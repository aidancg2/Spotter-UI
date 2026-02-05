from django.contrib import admin
from .models import (
    Profile, Follow, Friendship, Gym, GymMembership, GymTopLifter,
    Post, Reaction, Comment, PollVote, ExerciseDefinition,
    WorkoutTemplate, TemplateExercise, Workout, WorkoutExercise,
    WorkoutSet, PersonalRecord, Group, GroupMembership, Message,
    WorkoutInvite, Nudge, Achievement, UserAchievement, GroupStreak,
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'display_name', 'current_streak', 'status']
    list_filter = ['status']


@admin.register(Gym)
class GymAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'busy_level', 'current_activity']


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['user', 'post_type', 'created_at']
    list_filter = ['post_type']


@admin.register(ExerciseDefinition)
class ExerciseDefinitionAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'exercise_type']
    list_filter = ['category', 'exercise_type']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'completed', 'started_at']
    list_filter = ['completed']


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'creator', 'join_code', 'created_at']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['name', 'requirement_type', 'requirement_value']


admin.site.register(Follow)
admin.site.register(Friendship)
admin.site.register(GymMembership)
admin.site.register(GymTopLifter)
admin.site.register(Reaction)
admin.site.register(Comment)
admin.site.register(PollVote)
admin.site.register(WorkoutTemplate)
admin.site.register(TemplateExercise)
admin.site.register(WorkoutExercise)
admin.site.register(WorkoutSet)
admin.site.register(PersonalRecord)
admin.site.register(GroupMembership)
admin.site.register(Message)
admin.site.register(WorkoutInvite)
admin.site.register(Nudge)
admin.site.register(UserAchievement)
admin.site.register(GroupStreak)
