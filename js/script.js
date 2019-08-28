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
            for (var i = 0; i < data.length; i++) {
                $('#productList').append(`
                    <li
                        class="list-group-item d-flex justify-content-between align-items-center"
                        data-id="${data[i]._id}"
                    >
                        ${data[i].name}
                        <div>
                            <button class="btn btn-info editBtn">Edit</button>
                            <button class="btn btn-danger">Remove</button>
                        </div>
                    </li>
                `);
            }
        },
        error: function(err){
            console.log(err);
            console.log('something went wrong');
        }
    })
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

$('#lSubmit').click(function(){
  event.preventDefault();
  let lUsername = $('#lUsername').val();
  let lPassword = $('#lPassword').val();
  if(lPassword.length === 0 && lUsername.length === 0){
      console.log('please enter a (login) username and a (login) password');
  } else if(lPassword.length === 0){
      console.log('please enter a (login) password');
  } else if(lUsername.length === 0){
      console.log('please enter a (login) username');
  } else {
    console.log('okay, all logged in');
    console.log(`login password is ${lPassword}`);
  }
})

$('#rSubmit').click(function(){
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
