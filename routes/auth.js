var express = require('express');
var router = express.Router();
var getSupabaseClient = require('../supabaseClient').getSupabaseClient;

var isProduction = process.env.NODE_ENV === 'production';

router.get('/login', function (req, res) {
  res.render('auth/login', { title: 'Login' });
});

router.get('/signup', function (req, res) {
  res.render('auth/signup', { title: 'Create Account' });
});

router.post('/signup', async function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    return res
      .status(400)
      .render('auth/signup', { title: 'Create Account', error: 'Please provide both email and password.' });
  }

  try {
    var supabase = getSupabaseClient();
    var result = await supabase.auth.signUp({ email: email, password: password });

    if (result.error) {
      throw result.error;
    }

    var requiresVerification = !result.data.session;
    var successMessage = requiresVerification
      ? 'Signup succeeded. Please check your email to confirm your account.'
      : 'Signup succeeded. You are now logged in.';

    if (result.data.session) {
      setAuthCookies(res, result.data.session);
    }

    return res.render('auth/signup', {
      title: 'Create Account',
      success: successMessage,
      userEmail: result.data.user && result.data.user.email,
    });
  } catch (err) {
    return res
      .status(400)
      .render('auth/signup', { title: 'Create Account', error: err.message || 'Signup failed.' });
  }
});

router.post('/login', async function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    return res
      .status(400)
      .render('auth/login', { title: 'Login', error: 'Please provide both email and password.' });
  }

  try {
    var supabase = getSupabaseClient();
    var result = await supabase.auth.signInWithPassword({ email: email, password: password });

    if (result.error) {
      throw result.error;
    }

    if (result.data.session) {
      setAuthCookies(res, result.data.session);
    }

    return res.render('auth/login', {
      title: 'Login',
      success: 'Logged in successfully.',
      userEmail: result.data.user && result.data.user.email,
    });
  } catch (err) {
    return res.status(401).render('auth/login', { title: 'Login', error: err.message || 'Login failed.' });
  }
});

router.post('/logout', async function (req, res) {
  clearAuthCookies(res);

  try {
    var supabase = getSupabaseClient();
    await supabase.auth.signOut();
  } catch (err) {
    // Ignore missing credentials here; we still clear cookies.
  }

  res.redirect('/');
});

function setAuthCookies(res, session) {
  if (!session) return;

  var cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
  };

  res.cookie('sb-access-token', session.access_token, Object.assign({}, cookieOptions, { maxAge: session.expires_in * 1000 }));
  res.cookie(
    'sb-refresh-token',
    session.refresh_token,
    Object.assign({}, cookieOptions, { maxAge: 30 * 24 * 60 * 60 * 1000 })
  );
}

function clearAuthCookies(res) {
  res.clearCookie('sb-access-token');
  res.clearCookie('sb-refresh-token');
}

module.exports = router;
