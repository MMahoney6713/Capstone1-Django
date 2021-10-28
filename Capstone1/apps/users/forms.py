from allauth.socialaccount.forms import SignupForm
from django import forms
 
 
class CustomSignupForm(SignupForm):
    full_name = forms.CharField(max_length=30, label='Full Name')
 
    def save(self, request):
        user = super(CustomSignupForm, self).save(request)
        user.full_name = self.cleaned_data['full_name']
        user.save()
        return user