"""Seed the database with demo data for Spottr."""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import random

from core.models import (
    Profile, Follow, Friendship, Gym, GymMembership, GymTopLifter,
    Post, Reaction, Comment, ExerciseDefinition, WorkoutTemplate,
    TemplateExercise, Workout, WorkoutExercise, WorkoutSet,
    PersonalRecord, Group, GroupMembership, Message, WorkoutInvite,
    Achievement, UserAchievement, GroupStreak,
)


class Command(BaseCommand):
    help = 'Seed the database with demo data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # --- Users ---
        demo, _ = User.objects.get_or_create(username='demo', defaults={
            'email': 'demo@spottr.app', 'first_name': 'Demo',
        })
        demo.set_password('demo1234')
        demo.save()

        users_data = [
            ('alex_lifts', 'Alex', 'Martinez', 'alex@spottr.app'),
            ('sarah_fit', 'Sarah', 'Johnson', 'sarah@spottr.app'),
            ('mike_gains', 'Mike', 'Chen', 'mike@spottr.app'),
            ('jess_run', 'Jessica', 'Williams', 'jess@spottr.app'),
            ('tyler_pr', 'Tyler', 'Brooks', 'tyler@spottr.app'),
            ('emma_gym', 'Emma', 'Davis', 'emma@spottr.app'),
            ('chris_fit', 'Chris', 'Anderson', 'chris@spottr.app'),
            ('olivia_w', 'Olivia', 'Wilson', 'olivia@spottr.app'),
        ]
        users = [demo]
        for uname, first, last, email in users_data:
            u, _ = User.objects.get_or_create(username=uname, defaults={
                'email': email, 'first_name': first, 'last_name': last,
            })
            u.set_password('pass1234')
            u.save()
            users.append(u)

        # --- Profiles ---
        emojis = ['💪', '🏋️', '🔥', '⚡', '🦁', '🐆', '🏃', '🎯', '🌟']
        bios = [
            'Just trying to get 1% better every day.',
            'Leg day is the best day. Fight me.',
            'Chasing PRs and good vibes.',
            'Marathon runner turned lifter.',
            'If the bar ain\'t bending, you\'re pretending.',
            'Early morning crew 5AM gang.',
            'Plant-based athlete.',
            'Consistency over intensity.',
            'No days off. Well, maybe Sundays.',
        ]
        statuses = ['online', 'offline', 'working-out']
        for i, u in enumerate(users):
            Profile.objects.update_or_create(user=u, defaults={
                'display_name': u.first_name or u.username,
                'avatar_emoji': emojis[i % len(emojis)],
                'bio': bios[i % len(bios)],
                'current_streak': random.randint(1, 47),
                'longest_streak': random.randint(20, 90),
                'workout_frequency': random.choice([4, 5, 6]),
                'status': 'online' if u == demo else random.choice(statuses),
            })

        # --- Follows & Friendships ---
        for u in users[1:]:
            Follow.objects.get_or_create(follower=demo, following=u)
            Follow.objects.get_or_create(follower=u, following=demo)
        for u in users[1:5]:
            u1, u2 = (demo, u) if demo.pk < u.pk else (u, demo)
            Friendship.objects.get_or_create(
                from_user=u1, to_user=u2,
                defaults={'accepted': True},
            )

        # --- Gyms ---
        gyms_data = [
            ('Iron Paradise Gym', '123 Main St, Downtown', 0.3, 45, 80, 'low'),
            ('FitLife Center', '456 Oak Ave, Midtown', 1.2, 62, 120, 'moderate'),
            ('PowerHouse Athletics', '789 Elm Blvd, Uptown', 2.5, 30, 100, 'low'),
        ]
        gyms = []
        for name, addr, dist, act, cap, busy in gyms_data:
            g, _ = Gym.objects.update_or_create(name=name, defaults={
                'address': addr,
                'distance_miles': dist,
                'current_activity': act,
                'max_capacity': cap,
                'busy_level': busy,
                'arms_pct': random.randint(15, 30),
                'legs_pct': random.randint(15, 30),
                'cardio_pct': random.randint(10, 25),
                'classes_pct': random.randint(5, 15),
            })
            gyms.append(g)

        # Enroll demo in first gym
        GymMembership.objects.get_or_create(user=demo, gym=gyms[0])
        for u in users[1:4]:
            GymMembership.objects.get_or_create(user=u, gym=gyms[0])

        # Top lifters
        for u in users[:5]:
            GymTopLifter.objects.update_or_create(gym=gyms[0], user=u, defaults={
                'squat': random.randint(225, 500),
                'bench': random.randint(185, 365),
                'deadlift': random.randint(315, 600),
            })

        # --- Exercises ---
        exercises_data = [
            ('Bench Press', 'chest', 'strength'), ('Incline Dumbbell Press', 'chest', 'strength'),
            ('Cable Flyes', 'chest', 'strength'), ('Push Ups', 'chest', 'strength'),
            ('Barbell Row', 'back', 'strength'), ('Pull Ups', 'back', 'strength'),
            ('Lat Pulldown', 'back', 'strength'), ('Seated Cable Row', 'back', 'strength'),
            ('Barbell Squat', 'legs', 'strength'), ('Leg Press', 'legs', 'strength'),
            ('Romanian Deadlift', 'legs', 'strength'), ('Leg Extensions', 'legs', 'strength'),
            ('Leg Curls', 'legs', 'strength'), ('Calf Raises', 'legs', 'strength'),
            ('Overhead Press', 'shoulders', 'strength'), ('Lateral Raises', 'shoulders', 'strength'),
            ('Face Pulls', 'shoulders', 'strength'), ('Rear Delt Flyes', 'shoulders', 'strength'),
            ('Barbell Curl', 'arms', 'strength'), ('Tricep Pushdown', 'arms', 'strength'),
            ('Hammer Curls', 'arms', 'strength'), ('Skull Crushers', 'arms', 'strength'),
            ('Deadlift', 'back', 'strength'), ('Front Squat', 'legs', 'strength'),
            ('Dumbbell Bench Press', 'chest', 'strength'),
            ('Treadmill Run', 'cardio', 'cardio'), ('Cycling', 'cardio', 'cardio'),
            ('Rowing Machine', 'cardio', 'cardio'), ('Jump Rope', 'cardio', 'cardio'),
            ('Stair Climber', 'cardio', 'cardio'),
        ]
        exercises = []
        for name, cat, etype in exercises_data:
            ex, _ = ExerciseDefinition.objects.get_or_create(
                name=name, defaults={'category': cat, 'exercise_type': etype}
            )
            exercises.append(ex)

        # --- Workout Templates ---
        templates_data = [
            ('Push Day', [0, 1, 14, 19], 75),
            ('Leg Day', [8, 9, 10, 11, 13], 80),
            ('Pull Day', [4, 5, 6, 18, 22], 85),
            ('Upper Body', [0, 4, 14, 18, 19], 90),
            ('Full Body', [0, 4, 8, 14, 18, 25], 105),
            ('HIIT Cardio', [25, 26, 27, 28, 29], 30),
        ]
        for tname, ex_indices, dur in templates_data:
            t, _ = WorkoutTemplate.objects.get_or_create(
                user=demo, name=tname,
                defaults={'estimated_duration': dur}
            )
            for order, idx in enumerate(ex_indices):
                TemplateExercise.objects.get_or_create(
                    template=t, exercise=exercises[idx],
                    defaults={'order': order, 'default_sets': 4, 'default_reps': 10}
                )

        # --- Workouts (recent) ---
        now = timezone.now()
        for days_ago in [0, 1, 3, 5]:
            w, created = Workout.objects.get_or_create(
                user=demo, name=f'Workout {days_ago}d ago',
                defaults={
                    'started_at': now - timedelta(days=days_ago, hours=1),
                    'completed_at': now - timedelta(days=days_ago),
                    'completed': True,
                    'duration_minutes': random.randint(40, 90),
                }
            )
            if created:
                for ex in random.sample(exercises[:20], 4):
                    we = WorkoutExercise.objects.create(
                        workout=w, exercise=ex, order=0
                    )
                    for s in range(1, 5):
                        WorkoutSet.objects.create(
                            workout_exercise=we, set_number=s,
                            weight=random.randint(95, 315),
                            reps=random.randint(5, 12),
                            completed=True,
                        )

        # --- Personal Records ---
        pr_exercises = [exercises[0], exercises[8], exercises[22]]
        pr_weights = [275, 405, 495]
        for ex, wt in zip(pr_exercises, pr_weights):
            PersonalRecord.objects.get_or_create(
                user=demo, exercise=ex,
                defaults={'weight': wt, 'achieved_at': now - timedelta(days=random.randint(1, 30))}
            )

        # --- Posts ---
        post_data = [
            {'user': demo, 'post_type': 'workout', 'content': 'Crushed push day today! Bench felt smooth.',
             'workout_name': 'Push Day', 'exercises_count': 4, 'sets_count': 16, 'duration_display': '1h 15m'},
            {'user': users[1], 'post_type': 'pr', 'content': 'New bench PR! Been chasing this for months.',
             'pr_exercise': 'Bench Press', 'pr_weight': 315},
            {'user': users[2], 'post_type': 'streak', 'content': "Can't stop won't stop!", 'streak_days': 30},
            {'user': users[3], 'post_type': 'checkin', 'content': 'Morning session at Iron Paradise.',
             'location': 'Iron Paradise Gym'},
            {'user': demo, 'post_type': 'workout', 'content': 'Leg day done. Walking is overrated anyway.',
             'workout_name': 'Leg Day', 'exercises_count': 5, 'sets_count': 20, 'duration_display': '1h 20m'},
            {'user': users[4], 'post_type': 'pr', 'content': '500lb deadlift club!',
             'pr_exercise': 'Deadlift', 'pr_weight': 500},
            {'user': users[5], 'post_type': 'checkin', 'content': 'Early bird gets the gains.',
             'location': 'FitLife Center'},
            {'user': users[1], 'post_type': 'workout', 'content': 'Upper body pump session.',
             'workout_name': 'Upper Body', 'exercises_count': 5, 'sets_count': 20, 'duration_display': '1h 30m'},
        ]
        for i, pd in enumerate(post_data):
            defaults = {
                'post_type': pd['post_type'],
                'workout_name': pd.get('workout_name', ''),
                'exercises_count': pd.get('exercises_count', 0),
                'sets_count': pd.get('sets_count', 0),
                'duration_display': pd.get('duration_display', ''),
                'pr_exercise': pd.get('pr_exercise', ''),
                'pr_weight': pd.get('pr_weight'),
                'streak_days': pd.get('streak_days'),
                'location': pd.get('location', ''),
            }
            p, created = Post.objects.get_or_create(
                user=pd['user'], content=pd['content'],
                defaults=defaults,
            )
            if created:
                # Backdate the post
                Post.objects.filter(pk=p.pk).update(created_at=now - timedelta(hours=i * 3 + 1))
                # Add reactions
                for reactor in random.sample(users, min(4, len(users))):
                    if reactor != pd['user']:
                        Reaction.objects.get_or_create(
                            post=p, user=reactor,
                            defaults={'reaction_type': random.choice(['heart', 'fire', 'flex', 'thumbsup'])}
                        )
                # Add a comment
                commenter = random.choice([u for u in users if u != pd['user']])
                Comment.objects.get_or_create(
                    post=p, user=commenter,
                    defaults={'content': random.choice([
                        'Beast mode! 💪', "Let's go!", 'Insane work!',
                        'Need to train with you!', 'Goals right there.',
                    ])}
                )

        # --- Groups ---
        groups_data = [
            ('Morning Crew', '🌅', 'MORN01'),
            ('PR Chasers', '🏆', 'PRCH01'),
            ('Leg Day Gang', '🦵', 'LEGS01'),
        ]
        for gname, emoji, code in groups_data:
            g, _ = Group.objects.get_or_create(
                name=gname, creator=demo,
                defaults={'avatar_emoji': emoji, 'join_code': code}
            )
            GroupMembership.objects.get_or_create(group=g, user=demo)
            for u in random.sample(users[1:], 3):
                GroupMembership.objects.get_or_create(group=g, user=u)
            for j in range(3):
                sender = random.choice([demo] + users[1:4])
                Message.objects.create(
                    group=g, sender=sender,
                    content=random.choice([
                        "Who's hitting the gym today?",
                        'Just finished a solid session.',
                        'Anyone want to train tomorrow AM?',
                        'New PR incoming!',
                        'Rest day today, back at it tomorrow.',
                    ]),
                )

        # --- Direct Messages ---
        for u in users[1:3]:
            for j in range(3):
                s = demo if j % 2 == 0 else u
                r = u if j % 2 == 0 else demo
                Message.objects.create(
                    sender=s, recipient=r,
                    content=random.choice([
                        'Hey, down for a workout later?',
                        'Just crushed it!',
                        'What time are you going tomorrow?',
                    ]),
                )

        # --- Workout Invites ---
        WorkoutInvite.objects.get_or_create(
            from_user=users[1], gym=gyms[0],
            defaults={
                'workout_type': 'Push Day', 'spots': 2,
                'scheduled_time': now + timedelta(hours=3),
            }
        )
        WorkoutInvite.objects.get_or_create(
            from_user=users[2], gym=gyms[0],
            defaults={
                'workout_type': 'Leg Day', 'spots': 3,
                'scheduled_time': now + timedelta(hours=5),
            }
        )

        # --- Achievements ---
        achievements_data = [
            ('First Steps', 'Complete your first workout', '🎯', 'workouts', 1),
            ('Week Warrior', 'Work out 7 days in a row', '⚔️', 'streak', 7),
            ('Iron Regular', 'Complete 50 workouts', '🏅', 'workouts', 50),
            ('Century Club', 'Complete 100 workouts', '💯', 'workouts', 100),
            ('Streak Master', 'Maintain a 30-day streak', '🔥', 'streak', 30),
            ('Social Butterfly', 'Make 10 friends', '🦋', 'friends', 10),
        ]
        for aname, desc, icon, req_type, req_val in achievements_data:
            a, _ = Achievement.objects.get_or_create(
                name=aname, defaults={
                    'description': desc, 'icon': icon,
                    'requirement_type': req_type, 'requirement_value': req_val,
                }
            )
            profile = demo.profile
            if req_type == 'workouts':
                progress = min(profile.total_workouts, req_val)
            elif req_type == 'streak':
                progress = min(profile.current_streak, req_val)
            else:
                progress = min(Follow.objects.filter(follower=demo).count(), req_val)

            UserAchievement.objects.update_or_create(
                user=demo, achievement=a,
                defaults={
                    'progress': progress,
                    'unlocked': progress >= req_val,
                    'unlocked_at': now if progress >= req_val else None,
                }
            )

        # --- Group Streaks ---
        for g in Group.objects.filter(creator=demo):
            GroupStreak.objects.update_or_create(
                group=g, defaults={
                    'current_streak': random.randint(5, 20),
                    'active_members': GroupMembership.objects.filter(group=g).count(),
                }
            )

        self.stdout.write(self.style.SUCCESS(
            f'Seeded: {User.objects.count()} users, {Post.objects.count()} posts, '
            f'{Gym.objects.count()} gyms, {ExerciseDefinition.objects.count()} exercises, '
            f'{Workout.objects.count()} workouts, {Group.objects.count()} groups'
        ))
        self.stdout.write(self.style.SUCCESS('Demo login: username=demo password=demo1234'))
