console.log('main.js loaded');

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$titleBar = null,
		$nav = $('#nav'),
		$wrapper = $('#wrapper');

	// Make sure breakpoints is defined before using it
	if (typeof breakpoints !== 'undefined') {
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '1025px',  '1280px' ],
			medium:   [ '737px',   '1024px' ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ],
		});
	}

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
				
				// Check for stored scroll target
				const scrollTarget = sessionStorage.getItem('scrollTarget');
				if (scrollTarget) {
					const $targetSection = $('#' + scrollTarget);
					if ($targetSection.length) {
						// Small delay to ensure everything is loaded
						setTimeout(() => {
							$('html, body').animate({
								scrollTop: $targetSection.offset().top - ($titleBar.height() || 0)
							}, 1000);
							
							// Clear the stored target
							sessionStorage.removeItem('scrollTarget');
						}, 100);
					}
				}
			}, 100);
		});

	// Tweaks/fixes.

		// Polyfill: Object fit.
			if (!browser.canUse('object-fit')) {

				$('.image[data-position]').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Apply img as background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', $this.data('position'))
							.css('background-size', 'cover')
							.css('background-repeat', 'no-repeat');

					// Hide img.
						$img
							.css('opacity', '0');

				});

			}

	// Header Panel.

		// Nav.
			var $nav_a = $nav.find('a');

			$nav_a
				.addClass('scrolly')
				.on('click', function(e) {
					e.preventDefault();
					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Get target section
					var targetId = $this.attr('href').substring(1);
					var $targetSection = $('#' + targetId);

					// Scroll to section
					$('html, body').animate({
						scrollTop: $targetSection.offset().top - ($titleBar.height() || 0)
					}, 1000);

					// Deactivate all links.
						$nav_a.removeClass('active');

					// Activate link *and* lock it
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '5vh',
							bottom: '5vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($nav_a.filter('.active-locked').length == 0) {

										$nav_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		// Title Bar.
			$titleBar = $(
				'<div id="titleBar">' +
					'<a href="#header" class="toggle"></a>' +
					'<span class="title">' + $('#logo').html() + '</span>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$header
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'header-visible'
				});

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				if (breakpoints.active('<=medium'))
					return $titleBar.height();

				return 0;

			}
		}).on('click', function(e) {
			e.preventDefault();
		});

})(jQuery);