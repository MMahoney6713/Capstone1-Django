from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, image_url=None, password=None):
        """
        Creates and saves a User with the given email, name, 
        and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            full_name=full_name,
            image_url=image_url,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name='admin', image_url=None, password=None):
        """
        Creates and saves a superuser with the given email, name, 
        and password.
        """
        user = self.create_user(
            email,
            password=password,
            full_name=full_name,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    full_name = models.CharField(max_length=100)
    image_url = models.CharField(max_length=200, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @classmethod
    def validate_registration_data(cls, data_obj):
        password1 = data_obj['password1']
        password2 = data_obj['password2']
        full_name = data_obj['fullname']
        email = data_obj['email']

        # Implement error handling here - or else in model based validation?

        # errors = {}
        # if password1 != password2:
        #     errors['password'] = 'Passwords do not match'
        # elif full_name == '':
        #     errors['name'] = 'A name must be entered'
        # elif email = '':
        #     errors[]
        return True


    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

    