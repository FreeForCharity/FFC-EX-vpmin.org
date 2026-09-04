if (toolbox_values.dtb_vb_enabled !== '1' || (toolbox_values.dtb_vb_enabled === '1' && self == top)) {


	jQuery(document).ready(function ($) {
		
		function dtb_equalize_heights(selector) {
			var heights = new Array();
			$(selector).each(function() {
				$(this).css('min-height', '0');
				$(this).css('max-height', 'none');
				$(this).css('height', 'auto');
		 		heights.push($(this).height());
			});
			var max = Math.max.apply( Math, heights );
			$(selector).each(function() {
				$(this).css('height', max + 'px');
			});
		}
		function dtb_equalize_heights_min(selector) {
			var heights = new Array();
			$(selector).each(function() {
				$(this).css('min-height', '0');
				$(this).css('max-height', 'none');
				$(this).css('height', 'auto');
		 		heights.push($(this).height());
			});
			var min = Math.min.apply( Math, heights );
			$(selector).each(function() {
				$(this).css('height', min + 'px');
			});
		}
		function dtb_equalize() {
			var iv = null;
			if(iv !== null) {window.clearTimeout(iv);}
			iv = setTimeout(function() {
				if (toolbox_values.dtb_equal_archive_boxed === '1') {
					dtb_equalize_heights('.dtb_archives .et_pb_post .dtb-post-wrap, .dtb-blog.et_pb_module .et_pb_post .dtb-post-wrap');
				}
				if (toolbox_values.dtb_equal_archive_img === '1') {
					dtb_equalize_heights_min('.entry-featured-image-url');
				}
				
				if (toolbox_values.dtb_enable_equal_height === '1') {
				
					var windowsize = $(window).width();
					if (windowsize > toolbox_values.dtb_equal_height_breakpoint) {
					
						$('.dtb-equal-height').each(function() {
							if (toolbox_values.dtb_equal_height_quote === '1') {
								var quote_in_row = $('.et_pb_testimonial_description', this);
								dtb_equalize_heights(quote_in_row);
							}
							
							if (toolbox_values.dtb_equal_height_pricing === '1') {
								var pricing_in_row = $('.et_pb_pricing_content', this);
								dtb_equalize_heights(pricing_in_row);
							}
							
							if (toolbox_values.dtb_equal_height_blurb === '1') {
								var blurbs_in_row = $('.et_pb_blurb_content', this);
								dtb_equalize_heights(blurbs_in_row);
							}
						});
					}
				}
				
			}, 120);
		}
		
		
		function dtb_Ajax_Fn1() {
			if (toolbox_values.dtb_readmore_text_enable === '1') {
				$('.more-link').text(toolbox_values.dtb_readmore_text);
			}
			if (toolbox_values.dtb_comments_styles === '1') {
				$('#respond #reply-title>span').text(toolbox_values.dtb_comments_text);
			}
			
			$('#dtb-before-footer').detach().insertBefore('#main-footer, .et-l--footer');
			$('#dtb-after-footer').detach().insertAfter('#main-footer, .et-l--footer');
			$('#dtb-after-blog-content').detach().insertBefore('#comment-wrap');
			
			
			if( $( '.et_social_inline_bottom' ).length ) {
				if ( $( 'body' ).hasClass( 'et_pb_pagebuilder_layout' ) ) {
					var social_monarch = $('.et_social_inline_bottom').closest('.et_pb_row');
					$( '.entry-content .et_pb_section' ).not( '.et_pb_fullwidth_section' ).last().append( social_monarch );
				}
			}
		}
		
		function dtb_FixedBeforeHeader() {	
			if ( $('body:not(.et-fb) #dtb-before-header').length > 0 ) {
				$('body').addClass('has-dtb-before-header');
				var dtbBeforeHeader = $('body:not(.et-fb) #dtb-before-header');
				if ($('#wpadminbar').length > 0) {
				  var dtbBeforeHeaderOffset = $('#wpadminbar').height();
				}
				else {
					var dtbBeforeHeaderOffset = 0;
				}
				dtbBeforeHeaderHeight = dtbBeforeHeader.height();
				dtbMenuTransformValue = 'translateY(' + dtbBeforeHeaderHeight + 'px)';
				dtbBeforeHeader.detach().prependTo('#page-container').each(function() {
					var dtb_before_header_container = $(this);
					if (dtb_before_header_container.children('#et-boc').length === 0) {
						dtb_before_header_container.children('div').wrap('<div id="et-boc"></div>');
					}
				});
				if ( $('body').hasClass('et_fixed_nav')) {
					dtbBeforeHeader.css({
					   'position' : 'fixed',
					   'top' : dtbBeforeHeaderOffset,
					   'width' : '100%',
					   'z-index' : '100001'
					});
					$('body:not(.et-fb)').css({'padding-top' : dtbBeforeHeaderHeight});
					$('#main-header').css({
					   'transform' : dtbMenuTransformValue
					});
					if ( $('#top-header').length > 0 ) {
						$('#top-header').css({
						   'transform' : dtbMenuTransformValue,
							'top' : dtbBeforeHeaderOffset+'!important'
						});
					}
				}
				
				if ( $('body:not(.et-fb) .dtb-fixed-always').length > 0 ) {
					dtbBeforeHeader.css({
					   'position' : 'fixed',
					   'top' : dtbBeforeHeaderOffset,
					   'width' : '100%',
					   'z-index' : '2'
					});
					$('#main-header').css({
					   'transform' : dtbMenuTransformValue
					});
					$('.dtb-fixed-always').css({
					   'transform' : dtbMenuTransformValue
					});
					$('body:not(.et-fb)').css({'padding-top' : dtbBeforeHeaderHeight});
				}
				var windowsize = $(window).width();
				if (windowsize < toolbox_values.dtb_mobile_breakpoint && toolbox_values.dtb_m_m_fixed !== '1') {
					dtbBeforeHeader.css({
					   'position' : 'absolute'
					});
				
				}
				
			}
			
			if (toolbox_values.dtb_move_page_below_header === '1') {
					if ( $('#dtb-before-header').length > 0 ) {
						var FixedHeaderHeight = $('.et_pb_section.dtb-fixed-always').outerHeight() + $('#dtb-before-header').outerHeight();
					} else {
						var FixedHeaderHeight = $('.et_pb_section.dtb-fixed-always').outerHeight();
					}
					dtbBodyTransformValue = 'translateY(' + FixedHeaderHeight + 'px)';
					$('#main-header').css({
					   'transform' : dtbBodyTransformValue
					});
					$('body:not(.et-fb)').css({'padding-top' : FixedHeaderHeight});
			}
		}
	
	   $(document).ajaxComplete(function() {
		   dtb_equalize();
		   dtb_Ajax_Fn1();
	   });
		$(window).resize(function() {
			dtb_equalize()
			dtb_FixedBeforeHeader()
		});
	   dtb_Ajax_Fn1();
		dtb_equalize();
		dtb_FixedBeforeHeader()
		
		
		if ((toolbox_values.dtb_btt === '1') && (toolbox_values.dtb_btt_link === '1')) {
			$('.et_pb_scroll_top').append('<a class="btt_link"></a>');
			$('.et_pb_scroll_top').off('click');
			$('.btt_link').attr('href', toolbox_values.dtb_btt_url);
		}

		if (toolbox_values.dtb_fixed_scroll === '1') {
			$(window).scroll(function(){
				if ($(window).scrollTop() >= toolbox_values.dtb_fixed_scroll_offset) {
					$('body').addClass('scrolled-down');
    			}
	 			else {
		 			$('body').removeClass('scrolled-down');
   			}
			});
		}
		
		if (toolbox_values.dtb_enable_sticky === '1') {
			$('.dtb-sticky').each(function() {
				var sticky_parent = $(this).parentsUntil('.et_pb_section');
				$(sticky_parent).css('overflow','initial');
			});
		}
		
		
		if ((toolbox_values.dtb_archive_styles === '1') || ((toolbox_values.dtb_blog_layout !== 'blog_default') && (toolbox_values.dtb_blog_layout !== ''))) {
			$('.dtb_archives .et_pb_post').contents().filter(function () { return this.nodeType === 3 && $.trim(this.nodeValue).length; }).wrap('<p class="dtb-post-content">');
			$('.dtb_archives .et_pb_post').each(function () {
				if ($('.dtb-post-wrap', this).length < 1) {
					$('>:not(.entry-featured-image-url)', this).not('.et_pb_gallery_post_type,.et_main_video_container,.et_audio_content').wrapAll('<div class="dtb-post-wrap"></div>');
				}
				if ($('.more-link', this).length < 1) {
					if ((toolbox_values.dtb_archive_button !== '') && (toolbox_values.dtb_archive_styles !== '')) {
						link_target = $(this).find('a').attr('href');
						$('.dtb-post-wrap', this).append("<a class='dtb-read-more " + toolbox_values.dtb_archive_btn_hover + "' href='" + link_target + "'>" + toolbox_values.dtb_readmore_text + "</a>");
					}
				}
			});
		}

		if (toolbox_values.dtb_sticky_footer === '1') {
			function positionFooter() {
				if ($('body:not(.et-fb) #main-footer').length > 0) {
				  var mFoo = $("body:not(.et-fb) #main-footer");
				}
				else if ($('body:not(.et-fb) .et-l--footer').length > 0){
					var mFoo = $("body:not(.et-fb) .et-l--footer");
				}
				if ($('body:not(.et-fb) #dtb-before-footer').length > 0) {
					var bFoo = $("body:not(.et-fb) #dtb-before-footer");
				}
				if ($('body:not(.et-fb) #dtb-after-footer').length > 0) {
					var aFoo = $("body:not(.et-fb) #dtb-after-footer");
				}
				
				var bodyHeight = $(document.body).height();
				if ($('.dtb-body-wrapper').length > 0) {
				  var bodyHeight = $('.dtb-body-wrapper').height();
				}
				if (typeof mFoo !== 'undefined') {
					var mFooHeight = mFoo.outerHeight()
				}
				else {
					var mFooHeight = 0;
				}
				if (typeof bFoo !== 'undefined') {
					var bFooHeight = bFoo.outerHeight()
				}
				else {
					var bFooHeight = 0;
				}
				if (typeof aFoo !== 'undefined') {
					var aFooHeight = aFoo.outerHeight()
				}
				else {
					var aFooHeight = 0;
				}
				
				
				var contentHeight = bodyHeight+bFooHeight+aFooHeight+mFooHeight;
				
				if ((contentHeight < $(window).height() && mFoo.css("position") === "fixed") || (bodyHeight < $(window).height() && mFoo.css("position") !== "fixed")) {
					if  ( (typeof aFoo !== 'undefined') && (aFoo.outerHeight() > 0) ) {
					mFoo.css({
						position: "fixed",
						bottom: aFoo.outerHeight() + "px",
						right: "0",
						left: "0"
					});
					} else {
					mFoo.css({
						position: "fixed",
						bottom: "0",
						right: "0",
						left: "0"
					});
					}
					if (typeof bFoo !== 'undefined') {
						bFoo.css({
							position: "fixed",
							bottom: mFoo.outerHeight() + aFoo.outerHeight() + "px",
							right: "0",
							left: "0"
						});
					}
					if (typeof aFoo !== 'undefined') {
						aFoo.css({
							position: "fixed",
							bottom: "0",
							right: "0",
							left: "0"
						});
					}
				}
				else {
					mFoo.css({
						position: "",
						bottom: "",
						right: "",
						left: ""
					});
					
					if (typeof bFoo !== 'undefined') {
						bFoo.css({
							position: "",
							bottom: "",
							right: "",
							left: ""
						});
					}
					
					if (typeof aFoo !== 'undefined') {
						aFoo.css({
							position: "",
							bottom: "",
							right: "",
							left: ""
						});
					}
				}
			}
			$(document).ready(function () {
				positionFooter();
				$(window).scroll(positionFooter);
				$(window).resize(positionFooter);
			});
		}
		if (toolbox_values.dtb_enable_typing === '1') {
			var count = 0;
			$('.et_pb_text.dtb-typing .et_pb_text_inner').each(function () {
				$(this).wrap("<div class='count-" + count + "'>");
				$(this).after("<span class='dtb-typed-" + count + "'>");
				count++;
			});
		}
		
		
		if (toolbox_values.dtb_mobile_parallax === '1') {
			$dtb_is_mobile = null !== (navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/))
			if ($dtb_is_mobile) {
				in_viewport = function(elem) {
					elementTop = elem.offset().top, elementBottom = elementTop + elem.outerHeight(), viewportTop = $(window).scrollTop(), viewportBottom = viewportTop + $(window).height();
					return elementBottom > viewportTop && elementTop < viewportBottom;
				};
				function mobileParallax() {
					$(".dtb-mobile-parallax .et_parallax_bg").each(function() {
						var $dtb_parent = $(this).parent();
						var $dtb_visible = in_viewport($dtb_parent);
						if ($dtb_visible) {
							element_top = $dtb_parent.offset().top,
							parallaxHeight = $(this).parent(".et_pb_fullscreen").length && $(window).height() > $dtb_parent.innerHeight() ? $(window).height() : $dtb_parent.innerHeight(),
							bg_height = .2 * $(window).height() + parallaxHeight,
							main_position = "translate(0, " + .2 * ($(window).scrollTop() + $(window).height() - element_top) + "px)";
							$(this).css({height: bg_height,"-webkit-transform": main_position,"-moz-transform": main_position,"-ms-transform": main_position,transform: main_position});
							
						}
					});
				}
				
				$(document).ready(function () {
					mobileParallax();
					$(window).scroll(mobileParallax);
				});
			}
		}
		
		if (toolbox_values.dtb_enable_popup === '1') {
			var popup_listener = false;
			// open popup on click
			
			
			$('#popup1, #popup2, #popup3, #popup4, #popup5').each(function() {
				var dtb_popup_container = $(this);
				if (dtb_popup_container.children('#et-boc').length === 0) {
					dtb_popup_container.children('div').wrap('<div id="et-boc"></div>');
				}
			});
			
			
			$('.popup1').each(function () {
				$(this).addClass('trigger-popup').attr('data-mfp-src', '#popup1');
			});
			$('.popup2').each(function () {
				$(this).addClass('trigger-popup').attr('data-mfp-src', '#popup2');
			});
			$('.popup3').each(function () {
				$(this).addClass('trigger-popup').attr('data-mfp-src', '#popup3');
			});
			$('.popup4').each(function () {
				$(this).addClass('trigger-popup').attr('data-mfp-src', '#popup4');
			});
			$('.popup5').each(function () {
				$(this).addClass('trigger-popup').attr('data-mfp-src', '#popup5');
			});


			if (toolbox_values.dtb_popup_number === '1') {
				$('a[href="#popup1"]').addClass('trigger-popup');
			}
			if (toolbox_values.dtb_popup_number === '2') {
				$('a[href="#popup1"],a[href="#popup2"]').addClass('trigger-popup');
			}
			if (toolbox_values.dtb_popup_number === '3') {
				$('a[href="#popup1"],a[href="#popup2"],a[href="#popup3"]').addClass('trigger-popup');
			}
			if (toolbox_values.dtb_popup_number === '4') {
				$('a[href="#popup1"],a[href="#popup2"],a[href="#popup3"],a[href="#popup4"]').addClass('trigger-popup');
			}
			if (toolbox_values.dtb_popup_number === '5') {
				$('a[href="#popup1"],a[href="#popup2"],a[href="#popup3"],a[href="#popup4"],a[href="#popup5"]').addClass('trigger-popup');
			}

			$('.trigger-popup').addClass('et_smooth_scroll_disabled');
			$('.trigger-popup').magnificPopup({
				removalDelay: 300,
				type: 'inline',
				mainClass: 'toolbox',
				fixedContentPos: true,
				zoom: { enabled: true, duration: 2000, easing: 'ease-in-out' },
				callbacks: { open: function () { $('body').addClass('blurred'); }, close: function () {
							$('body').removeClass('blurred'); 
							if ( $('div[id^="popup"] video').length > 0 ) {
								$('div[id^="popup"] video').get(0).pause();
							}
							} },
				prependTo: '#page-container'
			});
			$('.toolbox .mfp-content').addClass('container');
			$('.mobile_menu_bar').click(function () {
				if (!popup_listener) {
					popup_listener = true;
					$('.trigger-popup').magnificPopup({
						removalDelay: 300,
						type: 'inline',
						mainClass: 'toolbox',
						fixedContentPos: true,
						zoom: { enabled: true, duration: 2000, easing: 'ease-in-out' },
						callbacks: { open: function () { $('body').addClass('blurred'); }, close: function () {
							$('body').removeClass('blurred'); 
							if ( $('div[id^="popup"] video').length > 0 ) {
								$('div[id^="popup"] video').get(0).pause();
							}
							} },
						prependTo: '#page-container'
					});
				}
			})
		}


		if (toolbox_values.dtb_social_links === '1') {
			if (toolbox_values.dtb_skype_url !== '') {
				$('.et-social-icons').append('<li class="et-social-icon et-social-skype"><a href="' + toolbox_values.dtb_skype_url + '" class="icon"><span>Skype</span></a></li>')
			}
			if (toolbox_values.dtb_instagram_url !== '') {
				$('.et-social-icons').append('<li class="et-social-icon et-social-instagram"><a href="' + toolbox_values.dtb_instagram_url + '" class="icon"><span>Instagram</span></a></li>')
			}
			if (toolbox_values.dtb_youtube_url !== '') {
				$('.et-social-icons').append('<li class="et-social-icon et-social-youtube"><a href="' + toolbox_values.dtb_youtube_url + '" class="icon"><span>YouTube</span></a></li>')
			}
			if (toolbox_values.dtb_linkedin_url !== '') {
				$('.et-social-icons').append('<li class="et-social-icon et-social-linkedin"><a href="' + toolbox_values.dtb_linkedin_url + '" class="icon"><span>LinkedIn</span></a></li>')
			}
			if (toolbox_values.dtb_pinterest_url !== '') {
				$('.et-social-icons').append('<li class="et-social-icon et-social-pinterest"><a href="' + toolbox_values.dtb_pinterest_url + '" class="icon"><span>Pinterest</span></a></li>')
			}
			if (toolbox_values.dtb_tumblr_url !== '') {
				$('.et-social-icons').append('<li class="et-social-icon et-social-tumblr"><a href="' + toolbox_values.dtb_tumblr_url + '" class="icon"><span>Tumblr</span></a></li>')
			}
			if (toolbox_values.dtb_flickr_url !== '') {
				$('.et-social-icons').append('<li class="et-social-icon et-social-flickr"><a href="' + toolbox_values.dtb_flickr_url + '" class="icon"><span>Flickr</span></a></li>')
			}
			if (toolbox_values.dtb_dribble_url !== '') {
				$('.et-social-icons').append('<li class="et-social-icon et-social-dribble"><a href="' + toolbox_values.dtb_dribble_url + '" class="icon"><span>Dribble</span></a></li>')
			}
			if (toolbox_values.dtb_vimeo_url !== '') {
				$('.et-social-icons').append('<li class="et-social-icon et-social-vimeo"><a href="' + toolbox_values.dtb_vimeo_url + '" class="icon"><span>Vimeo</span></a></li>')
			}
		}

		if (toolbox_values.dtb_social_target === '1') {
			$('.et-social-icon a').attr('target', '_blank');
		}


		if ((toolbox_values.dtb_social_move === '1') && (toolbox_values.dtb_social_enable === '1')) {
			$('#top-header .et-social-icons').detach();
		}
		
		


		if (toolbox_values.dtb_social_enable === '1') {
			$('#top-header .et-social-icons a, #main-header .et-social-icons a').addClass(toolbox_values.social_head_hover);
			$('#footer-bottom .et-social-icons a').addClass(toolbox_values.social_foot_hover);
		}



		$('#footer-bottom .et-social-icons a').width($('#footer-bottom .et-social-icons a').height());
		$(window).on('resize', function () {
			$('#footer-bottom .et-social-icons a').width($('#footer-bottom .et-social-icons a').height());
		});


		

		if ((toolbox_values.dtb_fixed_logo === '1') && (toolbox_values.dtb_fixed_logo_url !== '')) {
			var oldURL = $('#logo').attr('src');
			function checkScroll() {
				var scrollPosition = $(window).scrollTop();
				if ( ($('#main-header').hasClass('et-fixed-header')) || (scrollPosition > 5)) {
					$('#logo').attr('src', toolbox_values.dtb_fixed_logo_url);
				}
				else {
					$('#logo').attr('src', oldURL);
				}
				$(window).on('scroll', function () {
					var scrollPosition = $(window).scrollTop();
					if ( ($('#main-header').hasClass('et-fixed-header')) && (scrollPosition > 5)) {
						$('#logo').attr('src', toolbox_values.dtb_fixed_logo_url);
					}
					else {
						$('#logo').attr('src', oldURL);
					}
				});
			}
			checkScroll();
			$(window).resize(checkScroll);
			
		}

		if ((toolbox_values.dtb_mobile_logo === '1') && (toolbox_values.dtb_mobile_logo_url !== '')) {
			var desktopURL = $('#logo').attr('src');
			function checkWidth() {
				var windowsize = $(window).width();

				if (windowsize < toolbox_values.dtb_mobile_breakpoint) {
					$('#logo').attr('src', toolbox_values.dtb_mobile_logo_url);
				}
				
				else {
					if (toolbox_values.dtb_fixed_logo !== '1') {
						$('#logo').attr('src', desktopURL);
					}
				}
				$(window).on('scroll', function () {
					var windowsize = $(window).width();
					if (windowsize < toolbox_values.dtb_mobile_breakpoint) {
						$('#logo').attr('src', toolbox_values.dtb_mobile_logo_url);
					}
				});
			}
			checkWidth();
			$(window).resize(checkWidth);
		}

		

		if (toolbox_values.dtb_comments_styles === '1') {
			$('#respond #submit, .comment-reply-link, #respond #et_pb_submit').addClass(toolbox_values.dtb_comments_btn_hover);
		}

		$('.et_pb_button').addClass(toolbox_values.dtb_buttons_hover);
		$('.' + toolbox_values.dtb_sec_btn_class).removeClass(toolbox_values.dtb_buttons_hover).addClass(toolbox_values.dtb_sec_btn_hover);


		

		function dtb_header_menu_split() {
			var $logo_container = $('#main-header > .container > .logo_container'),

				$et_top_navigation = $('#et-top-navigation'),
				$logo_container_splitted = $('.centered-inline-logo-wrap > .logo_container'),
				et_top_navigation_li_size = $et_top_navigation.children('nav').children('ul').children('li').size(),
				et_top_navigation_li_break_index = Math.round(et_top_navigation_li_size / 2) - 1,
				window_width = window.innerWidth;

			if (window_width > toolbox_values.dtb_mobile_breakpoint && $logo_container.length && $('body').hasClass('et_header_style_split')) {
				$('<li class="centered-inline-logo-wrap"></li>').insertAfter($et_top_navigation.find('nav > ul >li:nth(' + et_top_navigation_li_break_index + ')'));
				$logo_container.appendTo($et_top_navigation.find('.centered-inline-logo-wrap'));
			}

			if (window_width <= toolbox_values.dtb_mobile_breakpoint && $logo_container_splitted.length) {
				$logo_container_splitted.prependTo('#main-header > .container');
				$('#main-header .centered-inline-logo-wrap').remove();
			}
		}

		dtb_header_menu_split();
		$(window).resize(function () {
			dtb_header_menu_split();
		});

		var $slide_menu_container = $('.et_header_style_slide .et_slide_in_menu_container');
		if ($slide_menu_container.length && !$('body').hasClass('et_pb_slide_menu_active')) {
			$slide_menu_container.css({ right: '-' + parseInt($slide_menu_container.innerWidth()) + 'px', 'display': 'none' });
		}

		

		if (toolbox_values.dtb_post_author !== '') {
			$('.dtb-author-box').detach().insertAfter('.et_pb_post>.entry-content, .et_pb_module.et_pb_post_content');
		}
		if (toolbox_values.dtb_post_prev_next !== '') {
			$('.dtb-single-post-nav').detach().insertAfter('.et_pb_post>.entry-content, .et_pb_module.et_pb_post_content');;
		}
		if (toolbox_values.dtb_post_related !== '') {
			$('.dtb-related-posts').detach().insertAfter('.et_pb_post>.entry-content, .et_pb_module.et_pb_post_content');
		}

		if (toolbox_values.dtb_single_after_content_layout !== '') {
			$('.dtb-after-single-post').detach().insertAfter('.et_pb_post>.entry-content, .et_pb_module.et_pb_post_content');
		}

		if (toolbox_values.dtb_hide_post_title !== '') {
			$('.single-post .et_post_meta_wrapper h1.entry-title').detach();
		}

		if (toolbox_values.dtb_footer_reveal !== '') {
			function dtb_footer_height() {
				if ( $( "#main-footer" ).length ) {
					var footer_height = $('#main-footer').height();
				}
				else {
					var footer_height = $('.et-l--footer').height();
				}
				$('#page-container').css('margin-bottom', footer_height);
			}
			function dtb_remove_footer_height() {
				$('#page-container').css('margin-bottom', '0');
			}
			function dtb_footer_reveal_mobile_conditional() {
				if ($(window).width() > 980) {
					dtb_footer_height();
				} else {
					dtb_remove_footer_height();
				}
			}
			if (toolbox_values.dtb_footer_reveal_mobile_off !== '') {
				dtb_footer_reveal_mobile_conditional()
				$(window).resize(function () {
					dtb_footer_reveal_mobile_conditional()
				});
			}
			else {
				dtb_footer_height();
				$(window).resize(function () {
					dtb_footer_height();
				});
			}
		}

		if (toolbox_values.dtb_testimonial_photo !== '') {
			$('.et_pb_testimonial').each(function () {
				$('.et_pb_testimonial_portrait', this).detach().insertBefore($(this).find('.et_pb_testimonial_author'));
				$('.et_pb_testimonial_portrait, .et_pb_testimonial_author, .et_pb_testimonial_meta', this).wrapAll('<div class="clearfix"></div>');
			});
		}

	});

	jQuery(window).on("load", function($){
		var mbwidth = parseInt(toolbox_values.dtb_mobile_breakpoint);
		if ((jQuery(window).width() <= mbwidth) && jQuery('body').hasClass('dtb_mobile_slide')) {
			jQuery('#main-header .mobile_menu_bar, .dtb-fixed-always .mobile_menu_bar').click(function () {
				jQuery('body').toggleClass('noscroll');
			});
			jQuery('.mobile_menu_bar').click(function () {
				jQuery('#mobile_menu, .dtb-fixed-always .et_mobile_menu').css('min-height', (jQuery(window).height()) + 'px');
				jQuery('#mobile_menu, .dtb-fixed-always .et_mobile_menu').css('max-height', '100vh');
			});
		}
	});


	if (toolbox_values.dtb_follow_the_mouse === '1') {

		/*jQuery directional hover */
		!function (t) { t.fn.directionalHover = function (e) { var n = t.extend({}, t.fn.directionalHover.defaults, e), o = function (t, e, n, o, f, a, r, s) { var u = 0; o - s <= a / 2 && (u ^= 1), n - r >= f / 2 && (u ^= 2), o - s > a / 2 && (u ^= 4), n - r < f / 2 && (u ^= 8), i(u, t, e, n - r, o - s, f / 2, a / 2) }, i = function (t, e, n, o, i, u, l) { f(t, 9) ? a(o, i, u, l) ? s(e, n, 0, 2 * -u) : s(e, n, 2 * -l, 0) : f(t, 3) ? r(o, i, u, l) ? s(e, n, 2 * -l, 0) : s(e, n, 0, 2 * u) : f(t, 12) ? r(o, i, u, l) ? s(e, n, 0, 2 * -u) : s(e, n, 2 * l, 0) : f(t, 6) && (a(o, i, u, l) ? s(e, n, 2 * l, 0) : s(e, n, 0, 2 * u)) }, f = function (t, e) { return (t & e) === e }, a = function (t, e, n, o) { return o * t - n * e < 0 }, r = function (t, e, n, o) { return n * (e - o) + o * t - n * o < 0 }, s = function (t, e, o, i) { "in" === e ? t.animate({ top: o, left: i }, 0, function () { t.stop().animate({ top: 0, left: 0 }, n.speed, n.easing) }) : "out" === e && t.animate({ top: 0, left: 0 }, 0, function () { t.stop().animate({ top: o, left: i }, n.speed, n.easing) }) }; return this.css({ position: "relative", overflow: "hidden" }), this.find(n.overlay).css({ position: "absolute", top: "-100%" }), this.each(function () { var e = t(this); e.hover(function (t) { o(e.find(n.overlay), "in", t.pageX, t.pageY, e.width(), e.height(), Math.floor(e.offset().left), e.offset().top) }, function (t) { o(e.find(n.overlay), "out", t.pageX, t.pageY, e.width(), e.height(), Math.floor(e.offset().left), e.offset().top) }) }) }, t.fn.directionalHover.defaults = { overlay: ".et_overlay", easing: "swing", speed: 400 } }(jQuery);


		(function ($) {
			var triggerClassChange = $.fn.addClass;
			$.fn.addClass = function () {
				$(this).trigger('classChanged');
				return triggerClassChange.apply(this, arguments);
			}
		})(jQuery);
		jQuery(document).ready(function ($) {

			$('.et_pb_portfolio .et_pb_portfolio_item, .et_pb_fullwidth_portfolio .et_pb_portfolio_item, .et_pb_gallery .et_pb_gallery_item').directionalHover();
			$('div.et_pb_portfolio').find('li.et_pb_portfolio_filter a').on('classChanged', function () {
				setTimeout(function () {
					$('.et_pb_portfolio .et_pb_portfolio_item').directionalHover();
				});
			});

			$('div.et_pb_portfolio').on('classChanged', 'li.page a', function () {
				setTimeout(function () {
					$('.et_pb_portfolio .et_pb_portfolio_item').directionalHover();
				});
			});
		});
	}


	if (toolbox_values.dtb_mobile_nested === '1') {
		(function ($) {
			function dtb_setup_submenus() {
				$("<div class='sub-menu-toggle'></div>").insertBefore(".et_mobile_menu .menu-item-has-children > a, #dtb-m-menu .menu-item-has-children > a");
				
				$(".sub-menu-toggle").click(function (e) {
					e.preventDefault();
					$(this).toggleClass("popped");
				});
			}
			$(document).ready(function() {
				dtb_setup_submenus();
				var parent_links = $(".et_mobile_menu .menu-item-has-children > a, #dtb-m-menu .menu-item-has-children > a");
				var toggles = $(".sub-menu-toggle");
				parent_links.off();
				parent_links.each(function (i) {
					if ($(this).attr("href") === '#') {
						$(this).click(function () {
							toggles[i].click(function () {
								$(this).toggleClass('popped');
							});
						});
					}
				});
			});
		})(jQuery);
	}
}

jQuery(document).ready(function($) {
	function dtb_Ajax_Fn2() {
		if ((toolbox_values.dtb_blog_layout !== 'blog_default') && (toolbox_values.dtb_blog_layout !== '')) {
			$('.dtb-blog.et_pb_module .et_pb_post').each(function () {
				if ($('.dtb-post-wrap', this).length < 1) {
					$('>:not(.entry-featured-image-url)', this).not('.et_pb_gallery_post_type,.et_main_video_container,.et_audio_content').wrapAll('<div class="dtb-post-wrap"></div>');
				}
			});
		}
		
		if (toolbox_values.dtb_post_meta === '1') {
			$(".dtb-blog.et_pb_module .post-meta, .archive #left-area .et_pb_post .post-meta, .blog #left-area .et_pb_post .post-meta, .dtb-blog.et_pb_module .et_pb_title_meta_container").html(function () {
				return $(this).html().replace(/\|/g, '').replace('by', '').replace('por', '').replace('...', '').replace(/,/g, '');
			});
		}
	
		if (toolbox_values.dtb_sidebar_search !== '') {
			$('.et_pb_widget_area #searchsubmit, #sidebar #searchsubmit, .dtb-sidebar #searchsubmit').before('<span class="icon"></span>');
		}
		
		$('#top-menu-nav #top-menu li a, .dtb-menu ul.et-menu li a, #et-secondary-nav li.cta-link a').each(function () {
			if ($('>span', this).length < 1) {
				$(this).wrapInner('<span></span>');
			}
		});
		
		if (toolbox_values.dtb_cta_link === '1') {
			if (toolbox_values.dtb_cta_link_type === 'first_item') {
				$('#top-menu>li:first-child, #mobile_menu>li:first-child, .dtb-menu .et-menu>li:first-child, .dtb-menu .et_mobile_menu>li:first-child').addClass('cta-item');
			}
			if (toolbox_values.dtb_cta_link_type === 'last_item') {
				$('#top-menu>li:last-child, #mobile_menu>li:last-child, .dtb-menu .et-menu>li:last-child, .dtb-menu .et_mobile_menu>li:last-child').addClass('cta-item');
			}
			if (toolbox_values.dtb_cta_link_type === 'custom_class') {
				$('#top-menu>li.cta-link, #mobile_menu>li.cta-link, .dtb-menu .et-menu>li.cta-link, .dtb-menu .et_mobile_menu>li.cta-link, #et-secondary-nav>li.cta-link').addClass('cta-item');
			}
			$('#top-menu>li.cta-item>a,.dtb-menu .et-menu>li.cta-item>a, #et-secondary-nav>li.cta-item>a').addClass(toolbox_values.cta_hover_style);
		}
		
		
		if ((toolbox_values.dtb_social_mobile_add === '1') && (toolbox_values.dtb_social_enable === '1')) {
			$('body>.et-social-icons').detach().appendTo('[id^="mobile_menu"], .dtb-menu .et_mobile_menu');
		}
	}

   $(document).ajaxComplete(function() {
	   dtb_Ajax_Fn2();
   });
   dtb_Ajax_Fn2();
   
   
	if ($('.custom_hamburger_icon').length > 0) {
		var iconName = 'hamburger_menu_icon',
			toggledName = iconName + '-toggled';
		$('.mobile_menu_bar').addClass(iconName).html('<div class="dtb-hamburger"><div class="dtb-hamburger-box"><div class="dtb-hamburger-inner"></div></div></div>');
		  
		$('.' + iconName).on('click', function (e) {
			e.preventDefault();
			$(this).toggleClass(toggledName);
			$('.et_slide_in_menu_container .mobile_menu_bar').toggleClass(toggledName);
		});	
		
		$('.et_slide_in_menu_container .mobile_menu_bar').click(function(){
			$('.hamburger_menu_icon-toggled').removeClass('hamburger_menu_icon-toggled');
		});
	}
		
});




jQuery(document).ready(function($) {
	
	
	function CustomMobileMenu() {


		if ((toolbox_values.dtb_enable_custom_m_menu !== '') && (toolbox_values.dtb_mobile_enable !== '')) {
			$('#dtb-m-menu').detach().insertAfter('#page-container');
			//if (toolbox_values.dtb_m_m_hamburger_show !== '') {
				$('#main-header .mobile_menu_bar_toggle, .et_slide_in_menu_container .mobile_menu_bar, .et_toggle_slide_menu').clone().prependTo('#dtb-m-menu .nav-wrapper');
			//}
				
			if ((toolbox_values.dtb_custom_m_menu === '') && ($('.et_pb_module.dtb-menu').length > 0) ){
				$('#dtb-m-menu ul').detach();
				//if (toolbox_values.dtb_m_m_hamburger_show !== '') {
					$('.et_pb_module.dtb-menu .mobile_menu_bar').clone().prependTo('#dtb-m-menu .nav-wrapper');
				//}
				$('.et_pb_module.dtb-menu .et_mobile_menu').detach().appendTo('#dtb-m-menu .nav-wrapper').removeClass('et_mobile_menu').addClass('dtb-mobile-menu');
				
				
			}
			if ((toolbox_values.dtb_custom_m_menu !== '') && ($('.et_pb_module.dtb-menu').length > 0) /*&& (toolbox_values.dtb_m_m_hamburger_show !== '') */){
				$('.et_pb_module.dtb-menu .mobile_menu_bar').clone().prependTo('#dtb-m-menu .nav-wrapper');
				
				
			}
			if ((toolbox_values.dtb_m_m_animation_page !== '') && (toolbox_values.dtb_vb_enabled !== '1')) {
				
				$('#page-container, #dtb-m-menu').wrapAll('<div class="dtb-body-wrapper"/>');
				$('#page-container').wrap('<div class="dtb-page-container noanimation"/>');
				var dtbMenuHeight = $('#dtb-m-menu').height();
				var dtbAdminBar = $('#wpadminbar').height();
				var dtbMenuOffset = -1*(dtbMenuHeight-dtbAdminBar);
				var dtbMenucontainer = $('#dtb-m-menu');
				var dtbMenuAnimation	= toolbox_values.dtb_m_m_animation_type;
				if (dtbMenuAnimation === 'move_bottom')  {
					dtbMenucontainer.css('top', dtbMenuOffset);
				}
				if (dtbMenuAnimation === 'move_top')  {
					dtbMenucontainer.css('bottom', -dtbMenuHeight);
				}
				dtbMenucontainer.addClass('dtb-mobile-opacity');
			}
	
					
			$('.mobile_menu_bar_toggle, .et_pb_module.dtb-menu .mobile_menu_bar, #dtb-m-menu .mobile_menu_bar, #dtb-m-menu li.menu-item a[href*="#"]:not([href$="#"]), .et_header_style_fullscreen .mobile_menu_bar, .et_toggle_slide_menu').click(function(){
				$('#dtb-m-menu .mobile_menu_bar').toggleClass('hamburger_menu_icon-toggled');
				$('#dtb-m-menu').addClass('dtb-in');
				$('#dtb-m-menu').toggleClass('dtb-out');
				$('body').toggleClass('dtb-m-mobile-open stopscroll');
				$('.dtb-page-container').removeClass('noanimation');
				if (toolbox_values.dtb_m_m_animation_page !== '') {
					
					var dtbMenuAnimation	= toolbox_values.dtb_m_m_animation_type;
					var dtbMenuOpened = $('body').hasClass('dtb-m-mobile-open');
					var dtbPagecontainer = $('.dtb-page-container');
					var dtbMenucontainer = $('#dtb-m-menu');
					var dtbMenuHeight = $('#dtb-m-menu').height();
					if ( $('#wpadminbar').length ) {
						var dtbAdminBar = $('#wpadminbar').height();
						} else {
						var dtbAdminBar = 0 };
					var dtbMenuOffset = dtbMenuHeight-dtbAdminBar;
					
					if (toolbox_values.dtb_m_m_width !== '') {
						var dtbMenuWidth = '100%';
					} else { 
						var dtbMenuWidth = toolbox_values.dtb_m_m_width_max + 'px';
					}
					if (dtbMenuAnimation === 'move_left')  {
						
						if (dtbMenuOpened) {
							dtbPagecontainer.animate({right: dtbMenuWidth}, 500 );
							dtbMenucontainer.animate({right: "0"}, 500 );
						}
						if (!dtbMenuOpened) {
							dtbPagecontainer.animate({right: "0"}, 500 );
							dtbMenucontainer.animate({right: '-'+dtbMenuWidth}, 500 );
						}
					}
					if (dtbMenuAnimation === 'move_right')  {
						
						if (dtbMenuOpened) {
							dtbPagecontainer.animate({left: dtbMenuWidth}, 500 );
							dtbMenucontainer.animate({left: "0"}, 500 );
						}
						if (!dtbMenuOpened) {
							dtbPagecontainer.animate({left: "0"}, 500 );
							dtbMenucontainer.animate({left: '-'+dtbMenuWidth}, 500 );
						}
					}
					if (dtbMenuAnimation === 'move_bottom')  {
						
						if (dtbMenuOpened) {
							dtbPagecontainer.animate({top: dtbMenuHeight}, 500 );
							dtbMenucontainer.animate({top: dtbAdminBar}, 500 );
						}
						if (!dtbMenuOpened) {
							dtbPagecontainer.animate({top: "0"}, 500 );
							dtbMenucontainer.animate({top: '-'+dtbMenuOffset}, 500 );
						}
					}
					if (dtbMenuAnimation === 'move_top')  {
						
						if (dtbMenuOpened) {
							dtbPagecontainer.animate({bottom: dtbMenuHeight}, 500 );
							dtbMenucontainer.animate({bottom: 0}, 500 );
						}
						if (!dtbMenuOpened) {
							dtbPagecontainer.animate({bottom: "0"}, 500 );
							dtbMenucontainer.animate({bottom: '-'+dtbMenuHeight}, 500 );
						}
					}
				}
				
			});
			
			
			if (toolbox_values.dtb_m_mobile_trigger !== '') {
				$('#main-header .mobile_menu_bar, .et_pb_module.dtb-menu .mobile_menu_bar, #dtb-m-menu .mobile_menu_bar').not('.dtb-m-menu-trigger .mobile_menu_bar').not('.et_header_style_fullscreen .mobile_menu_bar').not('.et_header_style_slide .mobile_menu_bar').detach();
			}	
			
			
			$('#dtb-m-menu .mobile_menu_bar, #dtb-m-menu li.menu-item a[href*="#"]:not([href$="#"])').click(function(){
            $('.hamburger_menu_icon-toggled').removeClass('hamburger_menu_icon-toggled');
         });
			
			
		}
		
	}

	CustomMobileMenu();
	
	if (toolbox_values.dtb_m_m_animation_page !== '') {
		$(window).on('resize', function(event){
			var dtbMenuOpened = $('body').hasClass('dtb-m-mobile-open');
			var dtbMenuHeight = $('#dtb-m-menu').height();
			if ( $('#wpadminbar').length ) {
				var dtbAdminBar = $('#wpadminbar').height();
				} else {
				var dtbAdminBar = 0 };
			var dtbMenuOffset = -1*(dtbMenuHeight-dtbAdminBar);
			var dtbMenucontainer = $('#dtb-m-menu');
			var dtbMenuAnimation	= toolbox_values.dtb_m_m_animation_type;
			if (!dtbMenuOpened) {
				
				
				if (dtbMenuAnimation === 'move_bottom')  {
					dtbMenucontainer.css('top', dtbMenuOffset);
				}
				if (dtbMenuAnimation === 'move_top')  {
					dtbMenucontainer.css('bottom', -dtbMenuHeight);
				}
			}
		});
	}
	
	if ($('.page-template-page-template-blank .dtb-menu').length == 0) {
		$('.page-template-page-template-blank #dtb-m-menu, .page-template-page-template-blank .dtb-m-menu-trigger').detach()
	}
});


function dtbHideCachedMenu() {
	jQuery('body').removeClass('dtb-m-mobile-open stopscroll');
	jQuery('#dtb-m-menu').removeClass('dtb-in').addClass('dtb-out').attr('style', '');
	jQuery('.dtb-page-container').attr('style', '');
	jQuery('.hamburger_menu_icon-toggled').removeClass('hamburger_menu_icon-toggled');
}
window.addEventListener("pageshow", function() {
    dtbHideCachedMenu();
});	
