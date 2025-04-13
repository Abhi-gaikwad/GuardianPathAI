const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
      next(); // User is authenticated, continue to the route
    } else {
      res.status(401).json({ message: "Unauthorized. Please log in." });
    }
  };
  
  module.exports = isAuthenticated;