fetch("http://localhost:3000/auth/login", {
  method: "POST",
  body: JSON.stringify({ email: "doniyorbekyarkinovv@gmail.com",password:"qwerty"}),
}).then((res) => res.json()).then((data)=>console.log(data))