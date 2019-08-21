$.ajax({
    url: 'http://192.168.33.10:3000/allProducts',
    type: 'GET',
    dataType: 'json',
    success:function(data){
        for (var i = 0; i < data.length; i++) {
            $('#productList').append(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${data[i].name}
                    <div>
                        <button class="btn btn-info">Edit</button>
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


$('#addProductButton').click(function(){
    event.preventDefault();
    let productName = $('#productName').val();
    let productPrice = $('#productPrice').val();
    if(productName.length === 0){
        console.log('please enter a products name');
    } else if(productPrice.length === 0){
        console.log('please enter a products price');
    } else {
        console.log(`${productName} costs $${productPrice}`);
        $.ajax({
            url: 'http://192.168.33.10:3000/product',
            type: 'POST',
            data: {
                name: productName,
                price: productPrice,
                test: 'hello'
            },
            success:function(result){
                console.log(result);
            },
            error: function(error){
                console.log(error);
                console.log('something went wrong with sending the data');
            }
        })
    }
})
