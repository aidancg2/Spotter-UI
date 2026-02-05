from .models import WorkoutInvite


def global_context(request):
    context = {
        'show_header': True,
        'show_nav': True,
    }
    if request.user.is_authenticated:
        try:
            profile = request.user.profile
        except Exception:
            profile = None
        context['pending_invites_count'] = WorkoutInvite.objects.filter(
            to_user=request.user, status='pending'
        ).count()
        context['user_profile'] = profile
        context['user_streak'] = profile.current_streak if profile else 0
    else:
        context['show_header'] = False
        context['show_nav'] = False
    return context
