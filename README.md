ghiraldi-base-user
========================

The user plugin adds the concept of users to the ghiraldi system. This base
plugin is used to build a more robust user system, and can be administered in
the base admin interface.

This base class uses a mongoose database to store the login authentication 
information by default.  Other plugins can override this if they provide
their own login method on the /login route.