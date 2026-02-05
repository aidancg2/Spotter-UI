from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Sum
import json


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=50, blank=True)
    bio = models.CharField(max_length=150, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    avatar_emoji = models.CharField(max_length=10, default='💪')
    phone = models.CharField(max_length=20, blank=True)
    birthday = models.DateField(null=True, blank=True)
    workout_frequency = models.IntegerField(default=5, help_text='Target workouts per week')
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_workout_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
        ('working-out', 'Working Out'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='online')

    def __str__(self):
        return self.display_name or self.user.username

    @property
    def total_workouts(self):
        return self.user.workouts.filter(completed=True).count()

    @property
    def total_sets(self):
        from django.db.models import Count
        return WorkoutSet.objects.filter(
            workout_exercise__workout__user=self.user,
            workout_exercise__workout__completed=True,
            completed=True
        ).count()

    @property
    def total_weight(self):
        result = WorkoutSet.objects.filter(
            workout_exercise__workout__user=self.user,
            workout_exercise__workout__completed=True,
            completed=True
        ).aggregate(total=Sum('weight'))
        return result['total'] or 0

    @property
    def friends_count(self):
        return Friendship.objects.filter(
            models.Q(from_user=self.user) | models.Q(to_user=self.user),
            accepted=True
        ).count()

    @property
    def followers_count(self):
        return Follow.objects.filter(following=self.user).count()

    @property
    def following_count(self):
        return Follow.objects.filter(follower=self.user).count()


class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following_set')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers_set')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"


class Friendship(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendships_sent')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendships_received')
    accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        status = "friends" if self.accepted else "pending"
        return f"{self.from_user.username} -> {self.to_user.username} ({status})"


class Gym(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=300)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    max_capacity = models.IntegerField(default=100)
    current_activity = models.IntegerField(default=0)

    BUSY_CHOICES = [
        ('low', 'Not Crowded'),
        ('moderate', 'Moderately Crowded'),
        ('high', 'Very Crowded'),
        ('very_high', 'At Capacity'),
    ]
    busy_level = models.CharField(max_length=20, choices=BUSY_CHOICES, default='low')

    arms_count = models.IntegerField(default=0)
    legs_count = models.IntegerField(default=0)
    cardio_count = models.IntegerField(default=0)
    classes_count = models.IntegerField(default=0)
    other_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "gyms"

    def __str__(self):
        return self.name

    @property
    def distance(self):
        return "0.3 mi"

    @property
    def member_count(self):
        return self.memberships.count()


class GymMembership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gym_memberships')
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='memberships')
    is_active = models.BooleanField(default=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'gym')

    def __str__(self):
        return f"{self.user.username} @ {self.gym.name}"


class GymTopLifter(models.Model):
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='top_lifters')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gym_rankings')
    squat = models.IntegerField(default=0)
    bench = models.IntegerField(default=0)
    deadlift = models.IntegerField(default=0)

    @property
    def total(self):
        return self.squat + self.bench + self.deadlift

    class Meta:
        unique_together = ('gym', 'user')
        ordering = ['-squat']

    def __str__(self):
        return f"{self.user.username} at {self.gym.name}"


POST_TYPE_CHOICES = [
    ('workout', 'Workout'),
    ('pr', 'Personal Record'),
    ('streak', 'Streak'),
    ('checkin', 'Check-in'),
    ('post', 'Post'),
]


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    post_type = models.CharField(max_length=20, choices=POST_TYPE_CHOICES, default='post')
    content = models.TextField(blank=True)
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    location = models.CharField(max_length=200, blank=True)
    workout = models.ForeignKey('Workout', on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')

    # PR info
    pr_exercise = models.CharField(max_length=100, blank=True)
    pr_weight = models.IntegerField(null=True, blank=True)

    # Streak info
    streak_days = models.IntegerField(null=True, blank=True)

    # Check-in info
    gym = models.ForeignKey(Gym, on_delete=models.SET_NULL, null=True, blank=True)
    activities = models.CharField(max_length=200, blank=True, help_text='Comma-separated activities')

    # Poll
    has_poll = models.BooleanField(default=False)
    poll_question = models.CharField(max_length=200, blank=True)
    poll_options = models.TextField(blank=True, help_text='JSON list of options')

    # Hashtags
    hashtags = models.CharField(max_length=500, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.post_type} ({self.created_at})"

    @property
    def heart_count(self):
        return self.reactions.filter(reaction_type='heart').count()

    @property
    def thumbsup_count(self):
        return self.reactions.filter(reaction_type='thumbsup').count()

    @property
    def flex_count(self):
        return self.reactions.filter(reaction_type='flex').count()

    @property
    def fire_count(self):
        return self.reactions.filter(reaction_type='fire').count()

    @property
    def comment_count(self):
        return self.comments.count()

    @property
    def time_ago(self):
        diff = timezone.now() - self.created_at
        seconds = diff.total_seconds()
        if seconds < 60:
            return "just now"
        elif seconds < 3600:
            mins = int(seconds / 60)
            return f"{mins}m ago"
        elif seconds < 86400:
            hours = int(seconds / 3600)
            return f"{hours}h ago"
        else:
            days = int(seconds / 86400)
            return f"{days}d ago"

    def get_poll_options_list(self):
        if self.poll_options:
            try:
                return json.loads(self.poll_options)
            except (json.JSONDecodeError, TypeError):
                return []
        return []

    def get_hashtags_list(self):
        if self.hashtags:
            return [t.strip() for t in self.hashtags.split(',') if t.strip()]
        return []

    def get_activities_list(self):
        if self.activities:
            return [a.strip() for a in self.activities.split(',') if a.strip()]
        return []


class Reaction(models.Model):
    REACTION_CHOICES = [
        ('heart', '❤️'),
        ('thumbsup', '👍'),
        ('flex', '💪'),
        ('fire', '🔥'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reactions')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reactions')
    reaction_type = models.CharField(max_length=20, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f"{self.user.username} {self.reaction_type} on {self.post.id}"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.user.username}: {self.content[:50]}"


class PollVote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='poll_votes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='poll_votes')
    option_index = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')


class ExerciseDefinition(models.Model):
    CATEGORY_CHOICES = [
        ('chest', 'Chest'),
        ('back', 'Back'),
        ('legs', 'Legs'),
        ('shoulders', 'Shoulders'),
        ('arms', 'Arms'),
        ('cardio', 'Cardio'),
        ('core', 'Core'),
    ]
    TYPE_CHOICES = [
        ('strength', 'Strength'),
        ('cardio', 'Cardio'),
    ]
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    exercise_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='strength')

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.category})"


class WorkoutTemplate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_templates')
    name = models.CharField(max_length=100)
    exercises = models.ManyToManyField(ExerciseDefinition, through='TemplateExercise')
    estimated_duration = models.IntegerField(default=60, help_text='Minutes')
    last_used = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-last_used', '-created_at']

    def __str__(self):
        return f"{self.name} by {self.user.username}"

    @property
    def exercise_count(self):
        return self.template_exercises.count()


class TemplateExercise(models.Model):
    template = models.ForeignKey(WorkoutTemplate, on_delete=models.CASCADE, related_name='template_exercises')
    exercise = models.ForeignKey(ExerciseDefinition, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    default_sets = models.IntegerField(default=3)
    default_reps = models.IntegerField(default=10)
    default_weight = models.FloatField(null=True, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.template.name} - {self.exercise.name}"


class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workouts')
    name = models.CharField(max_length=100, default='Workout')
    template = models.ForeignKey(WorkoutTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    started_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    duration_minutes = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    image = models.ImageField(upload_to='workouts/', blank=True, null=True)
    posted_to_feed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.user.username} - {self.name} ({self.started_at.date()})"

    @property
    def exercise_count(self):
        return self.workout_exercises.count()

    @property
    def set_count(self):
        return WorkoutSet.objects.filter(
            workout_exercise__workout=self,
            completed=True
        ).count()

    @property
    def total_weight_lifted(self):
        result = WorkoutSet.objects.filter(
            workout_exercise__workout=self,
            completed=True
        ).aggregate(total=Sum('weight'))
        return result['total'] or 0


class WorkoutExercise(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='workout_exercises')
    exercise = models.ForeignKey(ExerciseDefinition, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.workout.name} - {self.exercise.name}"


class WorkoutSet(models.Model):
    workout_exercise = models.ForeignKey(WorkoutExercise, on_delete=models.CASCADE, related_name='sets')
    set_number = models.IntegerField(default=1)
    reps = models.IntegerField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    distance = models.FloatField(null=True, blank=True, help_text='In miles')
    time_seconds = models.IntegerField(null=True, blank=True)
    completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['set_number']

    def __str__(self):
        return f"Set {self.set_number}: {self.reps}x{self.weight}lbs"


class PersonalRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='personal_records')
    exercise = models.ForeignKey(ExerciseDefinition, on_delete=models.CASCADE)
    weight = models.FloatField()
    reps = models.IntegerField(default=1)
    video = models.FileField(upload_to='pr_videos/', blank=True, null=True)
    achieved_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-achieved_at']

    def __str__(self):
        return f"{self.user.username} - {self.exercise.name}: {self.weight}lbs"


class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300, blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups')
    members = models.ManyToManyField(User, through='GroupMembership', related_name='group_set')
    join_code = models.CharField(max_length=20, unique=True, blank=True)
    avatar_emoji = models.CharField(max_length=10, default='👥')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def member_count(self):
        return self.group_members.count()

    def save(self, *args, **kwargs):
        if not self.join_code:
            import random
            import string
            self.join_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        super().save(*args, **kwargs)


class GroupMembership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_memberships')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='group_members')
    is_admin = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'group')

    def __str__(self):
        return f"{self.user.username} in {self.group.name}"


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    # Either group or recipient, not both
    group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='received_messages')
    content = models.TextField()
    image = models.ImageField(upload_to='messages/', blank=True, null=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        target = self.group.name if self.group else self.recipient.username
        return f"{self.sender.username} -> {target}: {self.content[:50]}"


class WorkoutInvite(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    ]
    TYPE_CHOICES = [
        ('gym', 'Gym Invite'),
        ('friend', 'Friend Invite'),
    ]
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invites_sent')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invites_received')
    invite_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='friend')
    gym = models.ForeignKey(Gym, on_delete=models.SET_NULL, null=True, blank=True)
    workout_type = models.CharField(max_length=100, blank=True)
    scheduled_time = models.DateTimeField(null=True, blank=True)
    spots = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.from_user.username} invited {self.to_user.username} ({self.status})"


class Nudge(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='nudges_sent')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='nudges_received')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user.username} nudged {self.to_user.username}"


class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    icon = models.CharField(max_length=10, default='🏆')
    requirement_type = models.CharField(max_length=50)
    requirement_value = models.IntegerField(default=1)

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    unlocked = models.BooleanField(default=False)
    unlocked_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'achievement')

    def __str__(self):
        status = "unlocked" if self.unlocked else f"{self.progress}/{self.achievement.requirement_value}"
        return f"{self.user.username} - {self.achievement.name} ({status})"

    @property
    def progress_percent(self):
        if self.achievement.requirement_value == 0:
            return 100
        return min(100, int((self.progress / self.achievement.requirement_value) * 100))


class GroupStreak(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='streaks')
    current_streak = models.IntegerField(default=0)
    best_streak = models.IntegerField(default=0)
    active_members = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.group.name} streak: {self.current_streak}"
