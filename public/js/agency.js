(function($) {
    "use strict"; // Start of use strict
    
    $( window ).on( 'load', function() {
        $( '#preloader' ).delay( 100 ).fadeOut( "slow" );
        $( '#load' ).delay( 100 ).fadeOut( "slow" );
    });
    
    
    
    /*$( window ).on( 'mouseenter mouseleave', '.dropdown', function( e ) {
        console.log( 'dsfdddsdsdsf' );        
        var _d=$(e.target).closest('.dropdown');_d.addClass('show');
        setTimeout( function() {
            _d[_d.is( ':hover' )?'addClass':'removeClass']( 'show' );
        },300);
    });*/
    
    /*$('ul.navbar-nav li.dropdown').hover(function() {
        
        console.log( 'ccdscd' );
        
        $(this).addClass( 'show' );
    });*/
    
    
    // Smooth scrolling using jQuery easing
    $( 'a.js-scroll-trigger[href*="#"]:not([href="#"])' ).click( function() {
        if ( location.pathname.replace( /^\//, '' ) == this.pathname.replace( /^\//, '' ) && location.hostname == this.hostname ) {
            var target = $( this.hash );
            target = target.length ? target : $( '[name=' + this.hash.slice(1) + ']' );
            if ( target.length ) {
                $( 'html, body' ).animate({
                    scrollTop: ( target.offset().top - 50 )
                }, 1500, "easeInOutExpo" );
                return false;
            }
        }
    });
    
    // Closes responsive menu when a scroll trigger link is clicked
    $( '.js-scroll-trigger' ).click( function() {
        $( '.navbar-collapse' ).collapse( 'hide' );
    });
    
    // Activate scrollspy to add active class to navbar items on scroll
    $( 'body' ).scrollspy({
        target: '#mainNav',
        offset: 54
    });
    
    // Collapse the navbar when page is scrolled
    $( window ).on( 'scroll', function() {
        if ( $( "#mainNav" ).offset().top > 30 ) {
            $( "#mainNav" ).addClass( "navbar-shrink" );
        } else {
            $( "#mainNav" ).removeClass( "navbar-shrink" );
        }
    });
    
    $( '.form-control' ).on( 'focus', function() {
        $(this).parent( '.input-group' ).addClass( "input-group-focus" );
    }).on( "blur", function(){
        $(this).parent( ".input-group" ).removeClass( "input-group-focus" );
    });
    
    
    $( '.input-group input' ).blur( function() {
        var valor = $(this).val();
        if( valor === '' ){
            $(this).parent().addClass( "is-empty" );
        }
        else {
            $(this).parent().removeClass( "is-empty" );
        }
    });
    
    $( '.input-group select' ).blur( function() {
        var valor = $(this).val();
        if( valor === '' ){
            $(this).parent().addClass( "is-empty" );
        }
        else {
            $(this).parent().removeClass( "is-empty" );
        }
    });
    
    $( '.input-group textarea' ).blur( function() {
        var valor = $(this).val();
        if( valor === '' ){
            $(this).parent().addClass( "is-empty" );
        }
        else {
            $(this).parent().removeClass( "is-empty" );
        }
    });
    
    
    /*$( 'p.body' ).text( function( _, text) {
        return $.trim( text ).substring( 0, 400 ) + '...';
    });*/
    
    
    $( 'h5.title' ).text( function( _, text) {
        var tam = text.length;
        if( tam > 100 )
            return $.trim( text ).substring( 0, 100 ) + '...';
        else
            return text;
    });



    $( '.bs-docs-sidenav > li' ).on( 'click', function() {
        $( '.bs-docs-sidenav > li' ).removeClass( 'active' );
        $( this ).addClass( 'active' );
    });
    
    
    
    $( '#link1' ).on( 'click', function() {
        $('#sec2').hide();
        $('#sec3').hide();
        $('#sec4').hide();
        $('#sec5').hide();
        $('#sec1').fadeIn(800);
        $('html, body').animate({ scrollTop: $("#sec1").offset().top}, 100);
    });
    
    
    $( '#link2' ).on( 'click', function() {
        $('#sec1').hide();
        $('#sec3').hide();
        $('#sec4').hide();
        $('#sec5').hide();
        $('#sec2').fadeIn(800);
        $('html, body').animate({ scrollTop: $("#sec2").offset().top}, 100);
    });
    
    
    $( '#link3' ).on( 'click', function() {
        $('#sec1').hide();
        $('#sec2').hide();
        $('#sec4').hide();
        $('#sec5').hide();
        $('#sec3').fadeIn(800);
        $('html, body').animate({ scrollTop: $("#sec3").offset().top}, 100);
    });
    
    
    $( '#link4' ).on( 'click', function() {
        $('#sec1').hide();
        $('#sec2').hide();
        $('#sec3').hide();
        $('#sec5').hide();
        $('#sec4').fadeIn(800);
        $('html, body').animate({ scrollTop: $("#sec4").offset().top}, 100);
    });
    
    
    $( '#link5' ).on( 'click', function() {		    
        $('#sec1').hide();
        $('#sec2').hide();
        $('#sec3').hide();
        $('#sec4').hide();
        $('#sec5').fadeIn(800);
        $('html, body').animate({ scrollTop: $("#sec5").offset().top}, 100);
    });
    
    
    $( '.dropdown-menu' ).mouseover( function() {
        $( this ).stop( true ).animate( { opacity: 1 }, 250 );
      });
    $( '.dropdown-menu' ).mouseout( function() {
        $( this ).stop( true ).animate( { opacity: 0.9 }, 250 );
      });
    
    
    $( '#modal-contact .modal-dialog' ).mouseover( function() {
        $( this ).stop( true ).animate( { opacity: 1 }, 250 );
      });
    $( '#modal-contact .modal-dialog' ).mouseout( function() {
        $( this ).stop( true ).animate( { opacity: 0.9 }, 250 );
      });
    
    /*function randomInt (min, max) {
        console.log( 'dsdsdfsd' );
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }*/
    
    $( '.carousel' ).carousel( {
        interval: 1500
    });
    
    
    $( 'img' ).bind( 'contextmenu', function(e) {
        return false;
    });
    
    
    
    
    $(window).bind( 'scroll', function(e) {
        //redrawDotNav();
        //console.log( 'dffdgfgdgfdgfdfdgfdg' );
    });
    
    
    
    function redrawDotNav() {
        var topNavHeight = 50;
        var numDivs = $('section').length;
        
        $( '#dotNav li a' ).removeClass('active').parent('li').removeClass('active');
        
        $('section').each( function( i,item ) {
            var ele = $(item), nextTop, thisTop;
            console.log(ele.next().html());
            if ( typeof ele.next().offset() != "undefined" ) {
                nextTop = ele.next().offset().top;
            }
            else {
                nextTop = $(document).height();
            }
            if (ele.offset() !== null) {
                thisTop = ele.offset().top - ((nextTop - ele.offset().top) / numDivs);
            }
            else {
                thisTop = 0;
            }
            var docTop = $(document).scrollTop()+topNavHeight;
            if( docTop >= thisTop && (docTop < nextTop) ) {
                $('#dotNav li').eq(i).addClass('active');
            }
        });
    }
    
    $('#dotNav li').click(function(){
        var id = $(this).find('a').attr("href"),
            posi,
            ele,
            padding = $('.navbar-fixed-top').height();
        ele = $(id);
        posi = ($(ele).offset()||0).top - padding;
        $('html, body').animate({scrollTop:posi}, 'slow' );
        return false;
    });
    
    
    

})(jQuery);