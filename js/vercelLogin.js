exports.handler = async (event) => {
  const { email, password } = JSON.parse(event.body);

  // These come from environment variables set in Netlify UI
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  const authorized = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;

  return {
    statusCode: 200,
    body: JSON.stringify({ authorized }),
  };
};
