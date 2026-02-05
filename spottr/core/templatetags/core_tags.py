from django import template
from django.utils.safestring import mark_safe
import json

register = template.Library()


@register.filter
def get_item(dictionary, key):
    if isinstance(dictionary, dict):
        return dictionary.get(key)
    return None


@register.filter
def multiply(value, arg):
    try:
        return float(value) * float(arg)
    except (ValueError, TypeError):
        return 0


@register.filter
def divide(value, arg):
    try:
        return float(value) / float(arg)
    except (ValueError, TypeError, ZeroDivisionError):
        return 0


@register.filter
def percentage(value, total):
    try:
        return int((float(value) / float(total)) * 100)
    except (ValueError, TypeError, ZeroDivisionError):
        return 0


@register.filter
def to_json(value):
    return mark_safe(json.dumps(value))


@register.filter
def avatar_color(name):
    colors = [
        'bg-cyan-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
        'bg-orange-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500',
    ]
    idx = sum(ord(c) for c in str(name)) % len(colors)
    return colors[idx]


@register.filter
def streak_icon(streak):
    if streak >= 30:
        return '🔥'
    elif streak >= 14:
        return '⚡'
    elif streak >= 7:
        return '💪'
    elif streak >= 1:
        return '✨'
    return '💤'


@register.filter
def busy_color(level):
    colors = {
        'low': '#22c55e',
        'moderate': '#f97316',
        'high': '#ef4444',
        'very_high': '#a855f7',
    }
    return colors.get(level, '#6b7280')


@register.filter
def busy_label(level):
    labels = {
        'low': 'Not Crowded',
        'moderate': 'Moderately Crowded',
        'high': 'Very Crowded',
        'very_high': 'At Capacity',
    }
    return labels.get(level, 'Unknown')


@register.filter
def status_color(status):
    colors = {
        'online': '#22c55e',
        'offline': '#6b7280',
        'working-out': '#f97316',
    }
    return colors.get(status, '#6b7280')


@register.filter
def rank_suffix(rank):
    if 10 <= rank % 100 <= 20:
        suffix = 'th'
    else:
        suffix = {1: 'st', 2: 'nd', 3: 'rd'}.get(rank % 10, 'th')
    return f"{rank}{suffix}"


@register.filter
def duration_format(minutes):
    if minutes < 60:
        return f"{minutes}m"
    hours = minutes // 60
    mins = minutes % 60
    if mins == 0:
        return f"{hours}h"
    return f"{hours}h {mins}m"
