from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('preferences/', views.preferences_view, name='preferences'),
    path('logout/', views.logout_view, name='logout'),

    # Feed (default)
    path('', views.feed_view, name='feed'),
    path('post/checkin/', views.create_checkin, name='create_checkin'),
    path('post/create/', views.create_post, name='create_post'),
    path('post/<int:post_id>/react/', views.react_to_post, name='react_to_post'),
    path('post/<int:post_id>/comment/', views.add_comment, name='add_comment'),
    path('post/<int:post_id>/vote/', views.vote_poll, name='vote_poll'),

    # Profile
    path('profile/', views.profile_view, name='my_profile'),
    path('profile/<str:username>/', views.profile_view, name='user_profile'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('user/<int:user_id>/follow/', views.follow_user, name='follow_user'),
    path('user/<int:user_id>/friend/', views.add_friend, name='add_friend'),

    # Gym
    path('gym/', views.gym_view, name='gym'),
    path('gym/<int:gym_id>/join/', views.join_gym, name='join_gym'),
    path('gym/leave/', views.leave_gym, name='leave_gym'),
    path('gym/invite/', views.post_gym_invite, name='post_gym_invite'),
    path('gym/invite/<int:invite_id>/respond/', views.respond_gym_invite, name='respond_gym_invite'),
    path('gym/busy/', views.submit_busy_level, name='submit_busy_level'),

    # Leaderboard
    path('leaderboard/', views.leaderboard_view, name='leaderboard'),

    # Groups
    path('groups/', views.groups_view, name='groups'),
    path('groups/create/', views.create_group, name='create_group'),
    path('groups/join/', views.join_group, name='join_group'),
    path('groups/invite/', views.send_friend_invite, name='send_friend_invite'),
    path('invite/<int:invite_id>/respond/', views.respond_invite, name='respond_invite'),
    path('user/<int:user_id>/nudge/', views.nudge_user, name='nudge_user'),

    # Chat
    path('chat/<str:chat_type>/<int:chat_id>/', views.chat_view, name='chat'),
    path('chat/<str:chat_type>/<int:chat_id>/send/', views.send_message, name='send_message'),

    # Streaks
    path('streaks/', views.streaks_view, name='streaks'),

    # Workout
    path('workout/', views.track_workout_view, name='track_workout'),
    path('workout/new/', views.workout_builder_view, name='workout_builder_new'),
    path('workout/template/<int:template_id>/', views.workout_builder_view, name='workout_builder_template'),
    path('workout/<int:workout_id>/resume/', views.workout_builder_view, name='workout_builder_resume'),
    path('workout/<int:workout_id>/add-exercise/', views.add_exercise_to_workout, name='add_exercise'),
    path('workout/exercise/<int:exercise_id>/add-set/', views.add_set, name='add_set'),
    path('workout/set/<int:set_id>/update/', views.update_set, name='update_set'),
    path('workout/<int:workout_id>/complete/', views.complete_workout, name='complete_workout'),
    path('workout/<int:workout_id>/done/', views.workout_complete_view, name='workout_complete'),
    path('workout/<int:workout_id>/post/', views.post_workout_to_feed, name='post_workout'),
    path('workout/templates/', views.template_selector_view, name='template_selector'),
    path('workout/templates/create/', views.create_template, name='create_template'),
    path('workout/templates/<int:template_id>/delete/', views.delete_template, name='delete_template'),
]
