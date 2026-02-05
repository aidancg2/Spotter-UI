from django import forms
from django.contrib.auth.models import User
from .models import Profile, Post, Comment, Group, Message, WorkoutInvite, Workout, WorkoutTemplate


class LoginForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-input',
            'placeholder': 'Email address',
            'autocomplete': 'email',
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-input',
            'placeholder': 'Password',
            'autocomplete': 'current-password',
        })
    )


class SignUpForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-input',
            'placeholder': 'Email address',
        })
    )
    phone = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Phone number',
        })
    )
    display_name = forms.CharField(
        max_length=50,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Display Name',
        })
    )
    username = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Username',
        })
    )
    birthday = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-input',
            'type': 'date',
        })
    )
    password = forms.CharField(
        min_length=8,
        widget=forms.PasswordInput(attrs={
            'class': 'form-input',
            'placeholder': 'Password (8+ characters)',
        })
    )
    password_confirm = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-input',
            'placeholder': 'Confirm Password',
        })
    )

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('An account with this email already exists.')
        return email

    def clean_username(self):
        username = self.cleaned_data['username']
        if len(username) < 3:
            raise forms.ValidationError('Username must be at least 3 characters.')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError('This username is already taken.')
        return username

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')
        if password and password_confirm and password != password_confirm:
            self.add_error('password_confirm', 'Passwords do not match.')

        birthday = cleaned_data.get('birthday')
        if birthday:
            from datetime import date
            age = (date.today() - birthday).days // 365
            if age < 13:
                self.add_error('birthday', 'You must be at least 13 years old.')
        return cleaned_data


class PreferencesForm(forms.Form):
    bio = forms.CharField(
        max_length=150,
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-input',
            'placeholder': 'Tell us about yourself...',
            'rows': 3,
            'maxlength': 150,
        })
    )
    workout_frequency = forms.ChoiceField(
        choices=[(i, f'{i} days/week') for i in range(1, 8)],
        initial=5,
        widget=forms.Select(attrs={
            'class': 'form-input',
        })
    )


class ProfileEditForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['display_name', 'bio', 'avatar', 'avatar_emoji']
        widgets = {
            'display_name': forms.TextInput(attrs={'class': 'form-input'}),
            'bio': forms.Textarea(attrs={'class': 'form-input', 'rows': 3, 'maxlength': 150}),
            'avatar': forms.FileInput(attrs={'class': 'form-input'}),
            'avatar_emoji': forms.TextInput(attrs={'class': 'form-input'}),
        }


class QuickCheckinForm(forms.Form):
    image = forms.ImageField(
        required=False,
        widget=forms.FileInput(attrs={'class': 'form-input', 'accept': 'image/*'})
    )
    gym = forms.ModelChoiceField(
        queryset=None,
        required=False,
        empty_label='Select gym...',
        widget=forms.Select(attrs={'class': 'form-input'})
    )
    activities = forms.MultipleChoiceField(
        choices=[
            ('Arms', 'Arms'), ('Legs', 'Legs'), ('Push', 'Push'),
            ('Pull', 'Pull'), ('Cardio', 'Cardio'), ('Core', 'Core'),
            ('Back', 'Back'), ('Chest', 'Chest'), ('Shoulders', 'Shoulders'),
        ],
        required=False,
        widget=forms.CheckboxSelectMultiple(attrs={'class': 'activity-checkbox'})
    )
    other_activity = forms.CharField(
        max_length=100, required=False,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Other activity...'})
    )
    caption = forms.CharField(
        max_length=300, required=False,
        widget=forms.Textarea(attrs={'class': 'form-input', 'rows': 2, 'placeholder': "What are you hitting today?"})
    )

    def __init__(self, *args, **kwargs):
        from .models import Gym
        super().__init__(*args, **kwargs)
        self.fields['gym'].queryset = Gym.objects.all()


class PostForm(forms.Form):
    content = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-input',
            'rows': 4,
            'placeholder': "What's on your mind?",
        })
    )
    image = forms.ImageField(
        required=False,
        widget=forms.FileInput(attrs={'class': 'form-input', 'accept': 'image/*'})
    )
    hashtags = forms.CharField(
        max_length=500, required=False,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': '#fitness #gym #workout'})
    )
    has_poll = forms.BooleanField(required=False)
    poll_question = forms.CharField(
        max_length=200, required=False,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Ask a question...'})
    )
    poll_option_1 = forms.CharField(max_length=100, required=False,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Option 1'}))
    poll_option_2 = forms.CharField(max_length=100, required=False,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Option 2'}))
    poll_option_3 = forms.CharField(max_length=100, required=False,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Option 3'}))
    poll_option_4 = forms.CharField(max_length=100, required=False,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Option 4'}))
    pr_exercise = forms.CharField(max_length=100, required=False,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Exercise name'}))
    pr_weight = forms.IntegerField(required=False,
        widget=forms.NumberInput(attrs={'class': 'form-input', 'placeholder': 'Weight (lbs)'}))


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Write a comment...',
            })
        }


class GroupForm(forms.Form):
    name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Group name'})
    )
    description = forms.CharField(
        max_length=300, required=False,
        widget=forms.Textarea(attrs={'class': 'form-input', 'rows': 2, 'placeholder': 'Description'})
    )


class JoinGroupForm(forms.Form):
    join_code = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Enter group code'})
    )


class MessageForm(forms.Form):
    content = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Type a message...',
            'autocomplete': 'off',
        })
    )
    image = forms.ImageField(required=False)


class WorkoutInviteForm(forms.Form):
    workout_type = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'e.g. Push Day, Leg Day'})
    )
    message = forms.CharField(
        max_length=300, required=False,
        widget=forms.Textarea(attrs={'class': 'form-input', 'rows': 2, 'placeholder': 'Add a message...'})
    )
    spots = forms.IntegerField(
        min_value=1, max_value=10, initial=1,
        widget=forms.NumberInput(attrs={'class': 'form-input'})
    )


class BusyLevelForm(forms.Form):
    LEVEL_CHOICES = [
        (1, 'Not crowded'),
        (2, 'Not too crowded'),
        (3, 'Moderately crowded'),
        (4, 'Very crowded'),
        (5, 'At capacity'),
    ]
    level = forms.ChoiceField(
        choices=LEVEL_CHOICES,
        widget=forms.RadioSelect(attrs={'class': 'busy-radio'})
    )
