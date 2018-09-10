(function($) {
    
    "use strict";
    
    AOS.init();
    
    /*AOS.init({
      offset: 200,
      duration: 600,
      easing: 'ease-in-sine',
      delay: 100,
    });*/
    
    
    $( '#know_type' ).on( 'change', function( e ) {
        var valor = $(this).val();
        var item_1 = $( '.item-1' );
        var item_2 = $( '.item-2' );
        var item_3 = $( '.item-3' );
        item_1.html( '' );
        //item_2.html( '' );
        //item_3.html( '' );
        switch( valor ) {
            case 'NUEVA':
                item_1.append( '<input type="text" class="form-control" autocomplete="off" name="title" placeholder="ESCRIBE EL TITULO" />' );
                //item_2.append( '<input class="form-control-file mt-0" type="file" accept="image/*" name="fotos" id="fotos" multiple />' );
                //item_3.append( '<button class="btn" type="submit" id="upload-input">SUBIR</button>' );
                break;
            case 'EXISTENTE':
                item_1.append( '<select class="form-control mdb_select" id="mdb_select" name="title" placeholder="TITULO">\
                                <option value="">SELECCIONA LA PUBLICACION</option>\
                        </select>' );
                $.ajax({
                    url: '/posts/getid',
                    method: 'POST',
                    contentType: 'application/json',
                    success: function( response ) {
                        $( '#mdb_select' ).html( '' );
                        response.data.forEach( function( dato ) {
                            $( '#mdb_select' ).append( $('<option>', {
                                value: dato._id,
                                text: dato.title.substring( 0, 100 )
                            }));
                        });
                    }
                });
                //item_2.append( '<input class="form-control-file mt-0" type="file" accept="image/*" name="fotos" id="fotos" multiple />' );
                //item_3.append( '<button class="btn" type="submit" id="upload-input">SUBIR</button>' );
                break;
        }
    });
    
    
    
    $( document ).on( 'click', '.conf-users', function( e ) {
        $.ajax({
            url: '/posts/getusers',
            method: 'POST',
            contentType: 'application/json',
            success: function( response ) {
                var contenedor = $( '.tabla-cuerpo' );
                contenedor.html( '' );
                response.data.forEach( function( dato ) {
                    contenedor.append( '<tr id="' + dato._id + '" class="' + dato.password + '">\
                                            <td class="nickname" scope="row">' + dato.nickname + '</td>\
                                            <td class="type" >' + dato.type + '</td>\
                                        </tr>' );
                });
            }
        });
    });
    
    
    
    $( document ).on( 'click', '.tabla-cuerpo tr', function( e ) {
        var id = $( this ).attr( 'id' );
        $.ajax({
            url: '/posts/getuser',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({ id:id }),
            success: function( response ) {
                $( '#modal-edit .modal-dialog .modal-content .modal-body' ).find( '.label-floating' ).removeClass( 'is-empty' );
                $( '#modal-edit .modal-dialog .modal-content .modal-body #nickname' ).val( response.user.nickname );
                $( '#modal-edit .modal-dialog .modal-content .modal-body #type' ).val( response.user.type );
                $( '#modal-edit .modal-dialog .modal-content .modal-body #pass' ).val( response.user.password );
                $( '#modal-edit' ).modal( 'show' );
            }
        });
    });
    
    
    
    $( document ).click( function( event ) {
        var clickover = $(event.target);
        var _opened = $(".navbar-collapse").hasClass("navbar-collapse collapse show");
        if (_opened === true && !clickover.hasClass("navbar-toggler")) {
            $("button.navbar-toggler").click();
        }
    });
    
    
    
    $( document ).on( 'change', '.blog .numero', function( e ) {
        var perPage = $( this ).val();
        var order = $( '.blog .orden' ).val();
        var sort = $( '.blog .sort' ).val();
        window.location.href = window.location.origin + window.location.pathname + '?lim=' + perPage + '&order=' + order + '&sort=' + sort;
    });
    
    
    
    $( document ).on( 'change', '.blog .orden', function( e ) {
        var perPage = $( '.blog .numero' ).val();
        var order = $( this ).val();
        var sort = $( '.blog .sort' ).val();
        window.location.href = window.location.origin + window.location.pathname + '?lim=' + perPage + '&order=' + order + '&sort=' + sort;
    });
    
    
    
    $( document ).on( 'change', '.blog .sort', function( e ) {
        var perPage = $( '.blog .numero' ).val();
        var order = $( '.blog .orden' ).val();
        var sort = $( this ).val();
        window.location.href = window.location.origin + window.location.pathname + '?lim=' + perPage + '&order=' + order + '&sort=' + sort;
    });
    
    
    
    $( document ).on( 'change', '.number', function( e ) {
        var perPage = $( this ).val();
        window.location.href = window.location.origin + window.location.pathname + '?lim=' + perPage;
    });
    
    
    
    /*$( document ).on( 'change', '.category', function( e ) {
        var perPage = $( '.number' ).val();
        var category = $( this ).val();
        if( category == 'public' ) {
            window.location.href = window.location.origin + '/documentos?lim=' + perPage;
        }
        else {
            window.location.href = window.location.origin + '/private/documentos?lim=' + perPage;
        }        
    });*/
    
    
    /*$( document ).on( 'click', '.dropzone', function( e ) {
        var id = $( '.mdb_select' ).val();
        $.ajax({
            url: '/evento/upload',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id:id })
        });
    });*/
    


})(jQuery);