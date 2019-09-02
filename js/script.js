$(document).ready(function(){
  let serverURL;
  let serverPort;
  let url;
  let editing = false;

  $.ajax({
    url: 'config.json',
    type: 'GET',
    dataType: 'json',
    success:function(keys){
      serverURL = keys['SERVER_URL'];
      serverPort = keys['SERVER_PORT'];
      url = `${serverURL}:${serverPort}`;
      getProductsData();
    },
    error: function(){
      console.log('cannot find config.json file, cannot run application');
    }
  });

  getProductsData = () => {
      $.ajax({
          url: `${url}/allProducts`,
          type: 'GET',
          dataType: 'json',
          success:function(data){
            // console.log(sessionStorage);
            $('#productList').empty();

              for (var i = 0; i < data.length; i++) {
                let product = `<li
                                    class="list-group-item d-flex justify-content-between align-items-center"
                                    data-id="${data[i]._id}"
                                >`;
                product += data[i].name;
                if (sessionStorage.user_Name) {
                  product += `<div>
                                <button class="btn btn-info editBtn">Edit</button>
                                <button class="btn btn-danger">Remove</button>
                              </div>`
                }
                product += `</li>`;
                $('#productList').append(product);

              }

          },
          error: function(err){
              console.log(err);
              console.log('something went wrong');
          }
      })
  }

  hideEditProducts = (string) => {
    if (sessionStorage.username) {
      return string;
    }
  }

  $('#productList').on('click', '.editBtn', function() {
      event.preventDefault();
      const id = $(this).parent().parent().data('id');
      $.ajax({
          url: `${url}/product/${id}`,
          type: 'get',
          dataType: 'json',
          success:function(product){
              console.log(product);
              $('#productName').val(product['name']);
              $('#productPrice').val(product['price']);
              $('#productID').val(product['_id']);
              $('#addProductButton').text('Edit Product').addClass('btn-warning');
              $('#heading').text('Edit Product');
              editing = true;
          },
          error:function(err){
              console.log(err);
              console.log('something went wrong with getting the single product');
          }
      })

  });

  $('#addProductButton').click(function(){
      event.preventDefault();
      let productName = $('#productName').val();
      let productPrice = $('#productPrice').val();
      if(productName.length === 0){
          console.log('please enter a product name');
      } else if(productPrice.length === 0){
          console.log('please enter a product price');
      } else {
          if(editing === true){


              const id = $('#productID').val();
              $.ajax({
                  url: `${url}/editProduct/${id}`,
                  type: 'PATCH',
                  data: {
                      name: productName,
                      price: productPrice
                  },
                  success:function(result){
                      // edited result only shows up on refresh? maybe we can repopulate the product list in here.
                      $('#productName').val(null);
                      $('#productPrice').val(null);
                      $('#productID').val(null);
                      $('#addProductButton').text('Add New Product').removeClass('btn-warning');
                      $('#heading').text('Add New Product');
                      editing = false;
                  },
                  error: function(err){
                      console.log(err);
                      console.log('something went wront with editing the product');
                  }
              })


          } else {
              console.log(`${productName} costs $${productPrice}`);
              $.ajax({
                  url: `${url}/product`,
                  type: 'POST',
                  data: {
                      name: productName,
                      price: productPrice
                  },
                  success:function(result){
                      $('#productName').val(null);
                      $('#productPrice').val(null);
                      $('#productList').append(`
                          <li class="list-group-item d-flex justify-content-between align-items-center">
                              ${result.name}
                              <div>
                                  <button class="btn btn-info editBtn">Edit</button>
                                  <button class="btn btn-danger">Remove</button>
                              </div>
                          </li>
                      `);
                  },
                  error: function(error){
                      console.log(error);
                      console.log('something went wrong with sending the data');
                  }
              })
          }

      }
  })

  $('#loginTabBtn').click(function(){
    event.preventDefault();
    $('#registerTabBtn').removeClass('active');
    $('#registerForm').addClass('d-none');
    $('#loginTabBtn').addClass('active');
    $('#loginForm').show();
  });

  $('#registerTabBtn').click(function(){
    event.preventDefault();
    $('#loginTabBtn').removeClass('active');
    $('#loginForm').hide();
    $('#registerTabBtn').addClass('active');
    $('#registerForm').removeClass('d-none');
  });

  $('#loginForm').submit(function(){
    event.preventDefault();
    let username = $('#lUsername').val();
    let password = $('#lPassword').val();

    if(password.length === 0 && username.length === 0){
        console.log('please enter a (login) username and a (login) password');
    } else if(password.length === 0){
        console.log('please enter a (login) password');
    } else if(username.length === 0){
        console.log('please enter a (login) username');
    } else {
      $.ajax({
        url: `${url}/login`,
        type: 'POST',
        data: {
          username: username,
          password: password
        },
        success: function(result){
            // console.log(result);
            if (result === 'invalid username'){
              console.log(`sorry, that username doesn't exist`);
            } else if (result === 'invalid password'){
              console.log(`sorry, that's the wrong password`);
            } else {
              console.log(`let's get you logged in, champ`);
              console.log(result);

              // sessionStorage (and LocalStorage) allows you to save data into your web browser and will stay there until they get removed
              // sessionStorage will keep data until the session is finsihed (closing the tab or browser)
              // localStorage will keep the data forever until someone manually clears the localStorage cache.
              // This is how we will be creating our login system
              // If we save a value into sessionStorage or localStorage, if we keep refreshing our page, the value we saved will still be there.
              // In our document.ready() function bellow we are checking to see if there is a value in our sessionStorage called user_Name
              sessionStorage.setItem('user_Id', result._id);
              sessionStorage.setItem('user_Name', result.username);
              sessionStorage.setItem('user_Email', result.email);

              $('#lrModal').modal('hide');
              $('#loginBtn').hide();
              $('#logoutBtn').removeClass('d-none');
              $('#addProductSection').removeClass('d-none');
            }
            getProductsData();
        },
        error: function(err){
          console.log(err);
          console.log('got an error');
        }
      })
    }
  })

  $('#registerForm').submit(function(){
    event.preventDefault();
    let rUsername = $('#rUsername').val();
    let rPassword = $('#rPassword').val();
    let rEmail = $('#rEmail').val();
    let rConfirmPassword = $('#rConfirmPassword').val();
    if(rPassword.length === 0 && rUsername.length === 0 && rEmail.length === 0){
        console.log('please enter a (registration) username, a (registration) password, and a (registration) email');
    } else if(rPassword.length === 0 && rUsername.length === 0){
        console.log('please enter a (registration) password and a (registration) username');
    } else if(rUsername.length === 0 && rEmail.length === 0){
        console.log('please enter a (registration) username and a (registration) email');
    } else if(rPassword.length === 0 && rEmail.length === 0){
        console.log('please enter a (registration) password and a (registration) email');
    }  else if(rPassword.length === 0){
        console.log('please enter a (registration) password');
    } else if(rUsername.length === 0){
        console.log('please enter a (registration) username');
    } else if(rEmail.length === 0){
        console.log('please enter a (registration) email');
    } else if (rPassword != rConfirmPassword) {
      console.log(`password doesn't match`);
    } else {
      // console.log('okay, all registered');
      // console.log(`registration password is ${rPassword}`);
      $.ajax({
        url: `${url}/getUser`,
        type: 'POST',
        data: {
          username: rUsername,
          email: rEmail,
          password: rPassword
        },
        success: function(result){
          console.log(result);
        },
        error: function(result){
          console.log(result);
          console.log('got an error');
        }
      });
    }
  });


  const loginBtn = $('#loginBtn');
  const logoutBtn = $('#logoutBtn');

  logoutBtn.click(function(){
    sessionStorage.clear();
    getProductsData();
    loginBtn.show();
    logoutBtn.hide();
  });

  if (sessionStorage.username) {
    console.log(`already logged in; show dashboard`);
    loginBtn.hide();
    logoutBtn.removeClass('d-none');
    $('#addProductContainer').removeClass('d-none');
  }
  else {
    sessionStorage.clear();
    console.log(`need to login; don't show dashboard`);
    loginBtn.show();
    logoutBtn.addClass('d-none');
    $('#addProductContainer').hide();
  }

});

  // From here we are going to be using a lot of if statements to hide and show specifc elements.
  // If there is a value for user_Name, then we will see the logout button, but if there isn't then we will see the login/Register button.
  // to clear out sessionStorage we need to call. sessionStorage.clear() which will clear all the items in our session storage.
  // This will happen on a click function for our logout button
