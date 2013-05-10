ghiraldi-base-user
========================
The user plugin adds the concept of users to the ghiraldi system. This base
plugin is used to build a more robust user system, and can be administered in
the base admin interface.

Authentication is added using the passport package, and plugin implementations are
provided through ghiraldi-base-user-<authentication_method> packages.  Of course,
you can create your own package that implements any authentication mechanism
you'd like.

Some of the plugins that are (or will be) available:
    ghiraldi-base-user-auth-basic: adds a password and SHA1 salted hash to the user.
    ghiraldi-base-user-auth-facebook: adds facebook authenthcation to the user.
    ghiraldi-base-user-auth-oauth2: Adds oauth2 authentication to the user object.