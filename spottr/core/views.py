import json
from datetime import timedelta

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.db.models import Q, Count, Sum

from .models import (
    Profile, Follow, Friendship, Gym, GymMembership, GymTopLifter,
    Post, Reaction, Comment, PollVote, ExerciseDefinition,
    WorkoutTemplate, TemplateExercise, Workout, WorkoutExercise,
    WorkoutSet, PersonalRecord, Group, GroupMembership, Message,
    WorkoutInvite, Nudge, Achievement, UserAchievement, GroupStreak,
)
from .forms import (
    LoginForm, SignUpForm, PreferencesForm, ProfileEditForm,
    QuickCheckinForm, PostForm, CommentForm, GroupForm, JoinGroupForm,
    MessageForm, WorkoutInviteForm, BusyLevelForm,
)


# ─── Auth ────────────────────────────────────────────────────────────────────

def login_view(request):
    if request.user.is_authenticated:
        return redirect('feed')
    form = LoginForm()
    error = None
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
            if user is not None:
                login(request, user)
                return redirect('feed')
            else:
                error = 'Invalid email or password.'
    return render(request, 'auth/login.html', {'form': form, 'error': error})


def signup_view(request):
    form = SignUpForm()
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data['username'],
                email=form.cleaned_data['email'],
                password=form.cleaned_data['password'],
                first_name=form.cleaned_data['display_name'],
            )
            Profile.objects.create(
                user=user,
                display_name=form.cleaned_data['display_name'],
                phone=form.cleaned_data['phone'],
                birthday=form.cleaned_data['birthday'],
            )
            login(request, user)
            return redirect('preferences')
    return render(request, 'auth/signup.html', {'form': form})


@login_required
def preferences_view(request):
    profile = request.user.profile
    form = PreferencesForm()
    if request.method == 'POST':
        form = PreferencesForm(request.POST)
        if form.is_valid():
            profile.bio = form.cleaned_data['bio']
            profile.workout_frequency = int(form.cleaned_data['workout_frequency'])
            profile.save()
            return redirect('feed')
    return render(request, 'auth/preferences.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect('login')


# ─── Feed ────────────────────────────────────────────────────────────────────

@login_required
def feed_view(request):
    tab = request.GET.get('tab', 'main')

    if tab == 'friends':
        friend_ids = set()
        friendships = Friendship.objects.filter(
            Q(from_user=request.user) | Q(to_user=request.user),
            accepted=True
        )
        for f in friendships:
            friend_ids.add(f.from_user_id if f.to_user == request.user else f.to_user_id)
        following_ids = Follow.objects.filter(follower=request.user).values_list('following_id', flat=True)
        friend_ids.update(following_ids)
        posts = Post.objects.filter(user_id__in=friend_ids).select_related('user', 'user__profile', 'workout', 'gym')
    else:
        posts = Post.objects.all().select_related('user', 'user__profile', 'workout', 'gym')

    posts = posts[:50]

    # Get user reactions for displayed posts
    user_reactions = {}
    if posts:
        post_ids = [p.id for p in posts]
        reactions = Reaction.objects.filter(user=request.user, post_id__in=post_ids)
        for r in reactions:
            user_reactions[r.post_id] = r.reaction_type

    checkin_form = QuickCheckinForm()
    post_form = PostForm()
    comment_form = CommentForm()

    return render(request, 'feed/feed.html', {
        'posts': posts,
        'tab': tab,
        'user_reactions': user_reactions,
        'checkin_form': checkin_form,
        'post_form': post_form,
        'comment_form': comment_form,
    })


# ─── Post Actions ────────────────────────────────────────────────────────────

@login_required
@require_POST
def create_checkin(request):
    form = QuickCheckinForm(request.POST, request.FILES)
    if form.is_valid():
        activities = ','.join(form.cleaned_data.get('activities', []))
        other = form.cleaned_data.get('other_activity', '')
        if other:
            activities = f"{activities},{other}" if activities else other

        post = Post.objects.create(
            user=request.user,
            post_type='checkin',
            content=form.cleaned_data.get('caption', ''),
            image=form.cleaned_data.get('image'),
            gym=form.cleaned_data.get('gym'),
            activities=activities,
            location=str(form.cleaned_data.get('gym', '')),
        )
        # Update streak
        _update_streak(request.user)
        return redirect('feed')
    return redirect('feed')


@login_required
@require_POST
def create_post(request):
    form = PostForm(request.POST, request.FILES)
    if form.is_valid():
        poll_options = []
        if form.cleaned_data.get('has_poll'):
            for i in range(1, 5):
                opt = form.cleaned_data.get(f'poll_option_{i}', '').strip()
                if opt:
                    poll_options.append(opt)

        post_type = 'post'
        if form.cleaned_data.get('pr_exercise'):
            post_type = 'pr'

        post = Post.objects.create(
            user=request.user,
            post_type=post_type,
            content=form.cleaned_data['content'],
            image=form.cleaned_data.get('image'),
            hashtags=form.cleaned_data.get('hashtags', ''),
            has_poll=bool(poll_options),
            poll_question=form.cleaned_data.get('poll_question', ''),
            poll_options=json.dumps(poll_options) if poll_options else '',
            pr_exercise=form.cleaned_data.get('pr_exercise', ''),
            pr_weight=form.cleaned_data.get('pr_weight'),
        )
        _update_streak(request.user)
        return redirect('feed')
    return redirect('feed')


@login_required
@require_POST
def react_to_post(request, post_id):
    reaction_type = request.POST.get('reaction_type', 'heart')
    post = get_object_or_404(Post, id=post_id)
    existing = Reaction.objects.filter(user=request.user, post=post).first()
    if existing:
        if existing.reaction_type == reaction_type:
            existing.delete()
            return JsonResponse({'status': 'removed'})
        else:
            existing.reaction_type = reaction_type
            existing.save()
            return JsonResponse({'status': 'changed', 'type': reaction_type})
    else:
        Reaction.objects.create(user=request.user, post=post, reaction_type=reaction_type)
        return JsonResponse({'status': 'added', 'type': reaction_type})


@login_required
@require_POST
def add_comment(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    form = CommentForm(request.POST)
    if form.is_valid():
        Comment.objects.create(
            user=request.user,
            post=post,
            content=form.cleaned_data['content']
        )
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'status': 'ok'})
    return redirect('feed')


@login_required
@require_POST
def vote_poll(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    option_index = int(request.POST.get('option_index', 0))
    PollVote.objects.update_or_create(
        user=request.user, post=post,
        defaults={'option_index': option_index}
    )
    return JsonResponse({'status': 'ok'})


# ─── Profile ────────────────────────────────────────────────────────────────

@login_required
def profile_view(request, username=None):
    if username:
        profile_user = get_object_or_404(User, username=username)
    else:
        profile_user = request.user

    profile = profile_user.profile
    tab = request.GET.get('tab', 'posts')

    posts = Post.objects.filter(user=profile_user)
    recent_workouts = Workout.objects.filter(user=profile_user, completed=True)[:4]
    prs = PersonalRecord.objects.filter(user=profile_user).select_related('exercise')

    # Calendar data
    import calendar
    from datetime import date
    now = timezone.now()
    month = int(request.GET.get('month', now.month))
    year = int(request.GET.get('year', now.year))
    cal = calendar.monthcalendar(year, month)
    workout_dates = set(
        Workout.objects.filter(
            user=profile_user, completed=True,
            started_at__year=year, started_at__month=month
        ).values_list('started_at__day', flat=True)
    )
    post_dates = set(
        Post.objects.filter(
            user=profile_user,
            created_at__year=year, created_at__month=month
        ).values_list('created_at__day', flat=True)
    )

    is_following = False
    is_friend = False
    if request.user != profile_user:
        is_following = Follow.objects.filter(follower=request.user, following=profile_user).exists()
        is_friend = Friendship.objects.filter(
            Q(from_user=request.user, to_user=profile_user) |
            Q(from_user=profile_user, to_user=request.user),
            accepted=True
        ).exists()

    return render(request, 'profile/profile.html', {
        'profile_user': profile_user,
        'profile': profile,
        'tab': tab,
        'posts': posts,
        'recent_workouts': recent_workouts,
        'prs': prs,
        'calendar_weeks': cal,
        'calendar_month': month,
        'calendar_year': year,
        'calendar_month_name': calendar.month_name[month],
        'workout_dates': workout_dates,
        'post_dates': post_dates,
        'is_following': is_following,
        'is_friend': is_friend,
        'is_own_profile': request.user == profile_user,
    })


@login_required
@require_POST
def edit_profile(request):
    profile = request.user.profile
    form = ProfileEditForm(request.POST, request.FILES, instance=profile)
    if form.is_valid():
        form.save()
    return redirect('my_profile')


@login_required
@require_POST
def follow_user(request, user_id):
    target = get_object_or_404(User, id=user_id)
    existing = Follow.objects.filter(follower=request.user, following=target)
    if existing.exists():
        existing.delete()
        return JsonResponse({'status': 'unfollowed'})
    else:
        Follow.objects.create(follower=request.user, following=target)
        return JsonResponse({'status': 'followed'})


@login_required
@require_POST
def add_friend(request, user_id):
    target = get_object_or_404(User, id=user_id)
    existing = Friendship.objects.filter(
        Q(from_user=request.user, to_user=target) |
        Q(from_user=target, to_user=request.user)
    )
    if not existing.exists():
        Friendship.objects.create(from_user=request.user, to_user=target)
    return JsonResponse({'status': 'sent'})


# ─── Gym / Map ───────────────────────────────────────────────────────────────

@login_required
def gym_view(request):
    user_gym = GymMembership.objects.filter(user=request.user, is_active=True).first()
    gyms = Gym.objects.all()

    gym_detail = None
    top_lifters = []
    invites = []

    if user_gym:
        gym_detail = user_gym.gym
        top_lifters = GymTopLifter.objects.filter(gym=gym_detail).select_related('user', 'user__profile')[:10]
        invites = WorkoutInvite.objects.filter(
            gym=gym_detail, status='pending'
        ).select_related('from_user', 'from_user__profile')[:10]

    invite_form = WorkoutInviteForm()

    return render(request, 'gym/map.html', {
        'gyms': gyms,
        'user_gym': user_gym,
        'gym_detail': gym_detail,
        'top_lifters': top_lifters,
        'invites': invites,
        'invite_form': invite_form,
    })


@login_required
@require_POST
def join_gym(request, gym_id):
    gym = get_object_or_404(Gym, id=gym_id)
    GymMembership.objects.filter(user=request.user, is_active=True).update(is_active=False)
    GymMembership.objects.update_or_create(
        user=request.user, gym=gym,
        defaults={'is_active': True}
    )
    return redirect('gym')


@login_required
@require_POST
def leave_gym(request):
    GymMembership.objects.filter(user=request.user, is_active=True).update(is_active=False)
    return redirect('gym')


@login_required
@require_POST
def post_gym_invite(request):
    form = WorkoutInviteForm(request.POST)
    if form.is_valid():
        user_gym = GymMembership.objects.filter(user=request.user, is_active=True).first()
        if user_gym:
            # Create invite for all gym members
            members = GymMembership.objects.filter(
                gym=user_gym.gym, is_active=True
            ).exclude(user=request.user).select_related('user')
            for member in members[:20]:
                WorkoutInvite.objects.create(
                    from_user=request.user,
                    to_user=member.user,
                    invite_type='gym',
                    gym=user_gym.gym,
                    workout_type=form.cleaned_data['workout_type'],
                    message=form.cleaned_data.get('message', ''),
                    spots=form.cleaned_data['spots'],
                )
    return redirect('gym')


@login_required
@require_POST
def respond_gym_invite(request, invite_id):
    invite = get_object_or_404(WorkoutInvite, id=invite_id, to_user=request.user)
    action = request.POST.get('action', 'decline')
    invite.status = 'accepted' if action == 'accept' else 'declined'
    invite.save()
    return JsonResponse({'status': invite.status})


@login_required
@require_POST
def submit_busy_level(request):
    form = BusyLevelForm(request.POST)
    if form.is_valid():
        level_map = {
            '1': 'low', '2': 'low', '3': 'moderate', '4': 'high', '5': 'very_high'
        }
        user_gym = GymMembership.objects.filter(user=request.user, is_active=True).first()
        if user_gym:
            gym = user_gym.gym
            gym.busy_level = level_map.get(form.cleaned_data['level'], 'low')
            gym.save()
    next_url = request.POST.get('next', 'feed')
    return redirect(next_url)


# ─── Leaderboard ─────────────────────────────────────────────────────────────

@login_required
def leaderboard_view(request):
    tab = request.GET.get('tab', 'gym')

    gym_leaderboard = []
    friends_leaderboard = []

    if tab == 'gym':
        user_gym = GymMembership.objects.filter(user=request.user, is_active=True).first()
        if user_gym:
            members = GymMembership.objects.filter(
                gym=user_gym.gym, is_active=True
            ).select_related('user', 'user__profile')

            entries = []
            for m in members:
                profile = m.user.profile
                week_start = timezone.now() - timedelta(days=7)
                weekly_workouts = Workout.objects.filter(
                    user=m.user, completed=True, started_at__gte=week_start
                ).count()
                entries.append({
                    'user': m.user,
                    'profile': profile,
                    'weekly_workouts': weekly_workouts,
                    'streak': profile.current_streak,
                    'level': _get_level(profile.total_workouts),
                    'is_current_user': m.user == request.user,
                })
            entries.sort(key=lambda x: x['streak'], reverse=True)
            for i, e in enumerate(entries):
                e['rank'] = i + 1
            gym_leaderboard = entries
    else:
        friend_ids = set()
        friendships = Friendship.objects.filter(
            Q(from_user=request.user) | Q(to_user=request.user),
            accepted=True
        )
        for f in friendships:
            friend_ids.add(f.from_user_id if f.to_user == request.user else f.to_user_id)
        friend_ids.add(request.user.id)

        friends = User.objects.filter(id__in=friend_ids).select_related('profile')
        entries = []
        for friend in friends:
            profile = friend.profile
            week_start = timezone.now() - timedelta(days=7)
            weekly_workouts = Workout.objects.filter(
                user=friend, completed=True, started_at__gte=week_start
            ).count()
            entries.append({
                'user': friend,
                'profile': profile,
                'weekly_workouts': weekly_workouts,
                'streak': profile.current_streak,
                'level': _get_level(profile.total_workouts),
                'is_current_user': friend == request.user,
            })
        entries.sort(key=lambda x: x['streak'], reverse=True)
        for i, e in enumerate(entries):
            e['rank'] = i + 1
        friends_leaderboard = entries

    return render(request, 'leaderboard/leaderboard.html', {
        'tab': tab,
        'gym_leaderboard': gym_leaderboard,
        'friends_leaderboard': friends_leaderboard,
    })


# ─── Groups ──────────────────────────────────────────────────────────────────

@login_required
def groups_view(request):
    # Pending friend invites
    pending_invites = WorkoutInvite.objects.filter(
        to_user=request.user, status='pending', invite_type='friend'
    ).select_related('from_user', 'from_user__profile')

    # Friends list
    friend_ids = set()
    friendships = Friendship.objects.filter(
        Q(from_user=request.user) | Q(to_user=request.user),
        accepted=True
    )
    for f in friendships:
        friend_ids.add(f.from_user_id if f.to_user == request.user else f.to_user_id)
    friends = User.objects.filter(id__in=friend_ids).select_related('profile')

    # Groups
    user_groups = Group.objects.filter(
        group_members__user=request.user
    ).annotate(
        unread_count=Count(
            'messages',
            filter=Q(messages__read=False) & ~Q(messages__sender=request.user)
        )
    )

    group_form = GroupForm()
    join_form = JoinGroupForm()
    invite_form = WorkoutInviteForm()

    return render(request, 'groups/groups.html', {
        'pending_invites': pending_invites,
        'friends': friends,
        'user_groups': user_groups,
        'group_form': group_form,
        'join_form': join_form,
        'invite_form': invite_form,
    })


@login_required
@require_POST
def create_group(request):
    form = GroupForm(request.POST)
    if form.is_valid():
        group = Group.objects.create(
            name=form.cleaned_data['name'],
            description=form.cleaned_data.get('description', ''),
            creator=request.user,
        )
        GroupMembership.objects.create(user=request.user, group=group, is_admin=True)

        member_ids = request.POST.getlist('members')
        for uid in member_ids:
            try:
                user = User.objects.get(id=uid)
                GroupMembership.objects.get_or_create(user=user, group=group)
            except User.DoesNotExist:
                pass
    return redirect('groups')


@login_required
@require_POST
def join_group(request):
    form = JoinGroupForm(request.POST)
    if form.is_valid():
        try:
            group = Group.objects.get(join_code=form.cleaned_data['join_code'])
            GroupMembership.objects.get_or_create(user=request.user, group=group)
        except Group.DoesNotExist:
            pass
    return redirect('groups')


@login_required
def chat_view(request, chat_type, chat_id):
    if chat_type == 'group':
        group = get_object_or_404(Group, id=chat_id)
        messages = Message.objects.filter(group=group).select_related('sender', 'sender__profile')[:100]
        Message.objects.filter(group=group, read=False).exclude(sender=request.user).update(read=True)
        chat_name = group.name
        chat_avatar = group.avatar_emoji
        member_count = group.member_count
    else:
        other_user = get_object_or_404(User, id=chat_id)
        messages = Message.objects.filter(
            Q(sender=request.user, recipient=other_user) |
            Q(sender=other_user, recipient=request.user),
            group__isnull=True
        ).select_related('sender', 'sender__profile')[:100]
        Message.objects.filter(sender=other_user, recipient=request.user, read=False).update(read=True)
        chat_name = other_user.profile.display_name or other_user.username
        chat_avatar = other_user.profile.avatar_emoji
        member_count = None

    form = MessageForm()

    return render(request, 'chat/chat.html', {
        'messages': messages,
        'chat_type': chat_type,
        'chat_id': chat_id,
        'chat_name': chat_name,
        'chat_avatar': chat_avatar,
        'member_count': member_count,
        'form': form,
    })


@login_required
@require_POST
def send_message(request, chat_type, chat_id):
    form = MessageForm(request.POST, request.FILES)
    if form.is_valid():
        kwargs = {
            'sender': request.user,
            'content': form.cleaned_data['content'],
            'image': form.cleaned_data.get('image'),
        }
        if chat_type == 'group':
            kwargs['group'] = get_object_or_404(Group, id=chat_id)
        else:
            kwargs['recipient'] = get_object_or_404(User, id=chat_id)
        Message.objects.create(**kwargs)
    return redirect('chat', chat_type=chat_type, chat_id=chat_id)


@login_required
@require_POST
def nudge_user(request, user_id):
    target = get_object_or_404(User, id=user_id)
    Nudge.objects.create(from_user=request.user, to_user=target)
    return JsonResponse({'status': 'nudged'})


@login_required
@require_POST
def send_friend_invite(request):
    form = WorkoutInviteForm(request.POST)
    if form.is_valid():
        friend_ids = request.POST.getlist('friends')
        for uid in friend_ids:
            try:
                user = User.objects.get(id=uid)
                WorkoutInvite.objects.create(
                    from_user=request.user,
                    to_user=user,
                    invite_type='friend',
                    workout_type=form.cleaned_data['workout_type'],
                    message=form.cleaned_data.get('message', ''),
                    spots=form.cleaned_data['spots'],
                )
            except User.DoesNotExist:
                pass
    return redirect('groups')


@login_required
@require_POST
def respond_invite(request, invite_id):
    invite = get_object_or_404(WorkoutInvite, id=invite_id, to_user=request.user)
    action = request.POST.get('action', 'decline')
    invite.status = 'accepted' if action == 'accept' else 'declined'
    invite.save()
    return redirect('groups')


# ─── Streaks ─────────────────────────────────────────────────────────────────

@login_required
def streaks_view(request):
    profile = request.user.profile
    today = timezone.now().date()

    # Weekly progress
    week_start = today - timedelta(days=today.weekday())
    weekly_workouts = Workout.objects.filter(
        user=request.user, completed=True,
        started_at__date__gte=week_start
    ).count()
    weekly_post_count = Post.objects.filter(
        user=request.user,
        created_at__date__gte=week_start
    ).count()

    # Get days with activity this week
    week_days = []
    for i in range(7):
        day = week_start + timedelta(days=i)
        has_activity = Post.objects.filter(user=request.user, created_at__date=day).exists()
        week_days.append({
            'date': day,
            'day_name': day.strftime('%a'),
            'has_activity': has_activity,
            'is_today': day == today,
        })

    # Achievements
    achievements = UserAchievement.objects.filter(
        user=request.user
    ).select_related('achievement')

    # Group streaks
    group_streaks = GroupStreak.objects.filter(
        group__group_members__user=request.user
    ).select_related('group')

    streak_active = profile.last_workout_date == today or (
        profile.last_workout_date == today - timedelta(days=1)
    )

    return render(request, 'streaks/streaks.html', {
        'profile': profile,
        'weekly_workouts': weekly_workouts,
        'weekly_post_count': weekly_post_count,
        'week_days': week_days,
        'achievements': achievements,
        'group_streaks': group_streaks,
        'streak_active': streak_active,
    })


# ─── Workout ─────────────────────────────────────────────────────────────────

@login_required
def track_workout_view(request):
    # Active workout
    active_workout = Workout.objects.filter(
        user=request.user, completed=False
    ).first()

    # This week stats
    today = timezone.now().date()
    week_start = today - timedelta(days=today.weekday())
    week_workouts = Workout.objects.filter(
        user=request.user, completed=True,
        started_at__date__gte=week_start
    )
    weekly_count = week_workouts.count()
    weekly_sets = WorkoutSet.objects.filter(
        workout_exercise__workout__in=week_workouts,
        completed=True
    ).count()
    weekly_duration = sum(w.duration_minutes for w in week_workouts)

    templates = WorkoutTemplate.objects.filter(user=request.user)

    return render(request, 'workout/track.html', {
        'active_workout': active_workout,
        'weekly_count': weekly_count,
        'weekly_sets': weekly_sets,
        'weekly_duration': weekly_duration,
        'templates': templates,
    })


@login_required
def workout_builder_view(request, template_id=None, workout_id=None):
    workout = None
    template = None
    exercises = ExerciseDefinition.objects.all()
    categories = ExerciseDefinition.CATEGORY_CHOICES

    if workout_id:
        workout = get_object_or_404(Workout, id=workout_id, user=request.user)
    elif template_id:
        template = get_object_or_404(WorkoutTemplate, id=template_id, user=request.user)
        # Create workout from template
        workout = Workout.objects.create(
            user=request.user,
            name=template.name,
            template=template,
        )
        for te in template.template_exercises.all():
            we = WorkoutExercise.objects.create(
                workout=workout,
                exercise=te.exercise,
                order=te.order,
            )
            for i in range(te.default_sets):
                WorkoutSet.objects.create(
                    workout_exercise=we,
                    set_number=i + 1,
                    reps=te.default_reps,
                    weight=te.default_weight,
                )
        template.last_used = timezone.now()
        template.save()
    else:
        workout = Workout.objects.create(user=request.user, name='Empty Workout')

    workout_exercises = workout.workout_exercises.select_related('exercise').prefetch_related('sets').all()

    return render(request, 'workout/builder.html', {
        'workout': workout,
        'workout_exercises': workout_exercises,
        'exercises': exercises,
        'categories': categories,
    })


@login_required
@require_POST
def add_exercise_to_workout(request, workout_id):
    workout = get_object_or_404(Workout, id=workout_id, user=request.user)
    exercise_id = request.POST.get('exercise_id')
    exercise = get_object_or_404(ExerciseDefinition, id=exercise_id)
    order = workout.workout_exercises.count()
    we = WorkoutExercise.objects.create(workout=workout, exercise=exercise, order=order)
    # Create 3 default sets
    for i in range(3):
        WorkoutSet.objects.create(workout_exercise=we, set_number=i + 1)
    return redirect('workout_builder_resume', workout_id=workout.id)


@login_required
@require_POST
def add_set(request, exercise_id):
    we = get_object_or_404(WorkoutExercise, id=exercise_id, workout__user=request.user)
    next_num = we.sets.count() + 1
    WorkoutSet.objects.create(workout_exercise=we, set_number=next_num)
    return redirect('workout_builder_resume', workout_id=we.workout.id)


@login_required
@require_POST
def update_set(request, set_id):
    ws = get_object_or_404(WorkoutSet, id=set_id, workout_exercise__workout__user=request.user)
    ws.reps = request.POST.get('reps') or None
    ws.weight = request.POST.get('weight') or None
    ws.completed = request.POST.get('completed') == 'true'
    ws.save()
    return JsonResponse({'status': 'ok'})


@login_required
@require_POST
def complete_workout(request, workout_id):
    workout = get_object_or_404(Workout, id=workout_id, user=request.user)
    workout.completed = True
    workout.completed_at = timezone.now()
    diff = workout.completed_at - workout.started_at
    workout.duration_minutes = int(diff.total_seconds() / 60)
    workout.save()
    _update_streak(request.user)
    return redirect('workout_complete', workout_id=workout.id)


@login_required
def workout_complete_view(request, workout_id):
    workout = get_object_or_404(Workout, id=workout_id, user=request.user, completed=True)
    busy_form = BusyLevelForm()
    return render(request, 'workout/complete.html', {
        'workout': workout,
        'busy_form': busy_form,
    })


@login_required
@require_POST
def post_workout_to_feed(request, workout_id):
    workout = get_object_or_404(Workout, id=workout_id, user=request.user, completed=True)
    if not workout.posted_to_feed:
        description = request.POST.get('description', '')
        image = request.FILES.get('image')
        save_template = request.POST.get('save_template') == 'on'

        post = Post.objects.create(
            user=request.user,
            post_type='workout',
            content=description or f"Completed {workout.name}!",
            workout=workout,
            image=image,
            location=request.POST.get('location', ''),
        )
        workout.posted_to_feed = True
        workout.notes = description
        if image:
            workout.image = image
        workout.save()

        if save_template and not workout.template:
            template = WorkoutTemplate.objects.create(
                user=request.user,
                name=workout.name,
                estimated_duration=workout.duration_minutes,
                last_used=timezone.now(),
            )
            for we in workout.workout_exercises.all():
                TemplateExercise.objects.create(
                    template=template,
                    exercise=we.exercise,
                    order=we.order,
                    default_sets=we.sets.count(),
                    default_reps=we.sets.first().reps or 10 if we.sets.exists() else 10,
                    default_weight=we.sets.first().weight if we.sets.exists() else None,
                )
    return redirect('feed')


@login_required
def template_selector_view(request):
    templates = WorkoutTemplate.objects.filter(user=request.user)
    search = request.GET.get('search', '')
    if search:
        templates = templates.filter(name__icontains=search)
    return render(request, 'workout/templates.html', {
        'templates': templates,
        'search': search,
    })


@login_required
@require_POST
def create_template(request):
    name = request.POST.get('name', 'New Template')
    template = WorkoutTemplate.objects.create(user=request.user, name=name)
    return redirect('workout_builder_template', template_id=template.id)


@login_required
@require_POST
def delete_template(request, template_id):
    template = get_object_or_404(WorkoutTemplate, id=template_id, user=request.user)
    template.delete()
    return redirect('template_selector')


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _update_streak(user):
    profile = user.profile
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)

    if profile.last_workout_date == today:
        return  # Already counted today

    if profile.last_workout_date == yesterday:
        profile.current_streak += 1
    elif profile.last_workout_date != today:
        profile.current_streak = 1

    profile.last_workout_date = today
    if profile.current_streak > profile.longest_streak:
        profile.longest_streak = profile.current_streak
    profile.save()


def _get_level(total_workouts):
    if total_workouts >= 500:
        return 50
    elif total_workouts >= 200:
        return 40
    elif total_workouts >= 100:
        return 30
    elif total_workouts >= 50:
        return 20
    elif total_workouts >= 20:
        return 10
    elif total_workouts >= 5:
        return 5
    return 1
