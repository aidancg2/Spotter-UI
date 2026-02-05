from .models import WorkoutInvite


def global_context(request):
    context = {}
    if request.user.is_authenticated:
        context['pending_invites_count'] = WorkoutInvite.objects.filter(
            to_user=request.user, status='pending'
        ).count()
        profile = getattr(request.user, 'profile', None)
        context['user_profile'] = profile
        context['user_streak'] = profile.current_streak if profile else 0
    return context
