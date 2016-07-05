<!doctype html>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<html>
<head>
    <meta charset="utf-8">
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login User</title>
</head>

<body>


<div>
    <div>
        <div>
            <div>
                <h1>Login User</h1>
            </div>
             <form method="post" action="userInfoJsp">
              	<label for="u">User Name</label>
  				<input type="text" name="username" id="u"><br>
  				<label for="p">Password</label>
  				<input type="text" name="password" id="p"><br>
  				<input type="submit" value="Login"/>
            </form>
        </div>
    </div>
</div>

</body>
</html>
