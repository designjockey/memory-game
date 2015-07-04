var memory = function(){
	total_cards = 8;
	pause_before_hide = 1; //seconds
	failed_attempts = 0;
	game_over = false;
	timer = '';
	return{
		init: function(){
			memory.grid.create();
			memory.msg.updateFailed();
			memory.utils.updateTimer();

			//remove sidebar if mobile device
			if(memory.utils.isMobile()){
				$('#sidebar').fadeOut().remove();
			}

			var $flipcard = $('div.flip-card');
			//attach events to the cards after the grid is created
			$flipcard.on('click', function(){

				//do nothing if the card is matched
				if($(this).find('.matched').length > 0){
					return;
				}

				//display card
				memory.card.reveal($(this));

				var $active_cards = $flipcard.find('.active')
				;

				//$(this).addClass('active');

				if($active_cards.length === 2){
					var cid = 0,
						matched = false
					;

					$active_cards.each(function(idx,el){
						console.log($(el).attr('data-id'));

						if(cid === $(el).attr('data-id'))
						{
							//matched
							$active_cards.removeClass('active').addClass('matched');
							matched = true;
							return;
						}

						cid = $(el).attr('data-id');
					});

					if(matched === false){
						failed_attempts ++;
						memory.msg.updateFailed();
						//2 cards revealed by user, hide after pause
						setTimeout('memory.card.hide()', pause_before_hide * 1000);
					}
				}
				var $matched_cards = $('div.matched');
				console.log('matched = ' + $matched_cards.length);
				if($matched_cards.length === total_cards * 2){
					console.log('matched all');
					game_over = true;
					clearInterval(timer);
					//game over, all cards matched
					memory.msg.updateFailed();
				}
			});
		},
		card: {
			reveal: function($flipcard){
				$flipcard
					.find('div.flip')
					.css('transform', 'rotateY(180deg)')
					.addClass('active');
			},
			hide: function($flipcard){
				console.log('hiding');
				if(typeof $flipcard === 'undefined'){
					$('div.flip')
						.not('.matched')
						.attr('style', '')
						.removeClass('active');
				}
				else{
					$flipcard
						.attr('style', '')
						.removeClass('active');
				}
			}
		},
		grid: {
			create: function(){
				var cards = memory.utils.createArray(total_cards),
					html = ''
				;

				$.each(cards, function(i,v){
					html += '<div class="flip-card">';
					html += '	<div class="flip" data-id="' + v + '">';
					html += '		<div class="front">';
					html += '			<div class="card back"></div>';
					html += '		</div>';
					html += '		<div class="reverse">';
					html += '			<div class="card c' + v + '"></div>';
					html += '		</div>';
					html += '	</div>';
					html += '</div>';
				});

				$('#memory-cards').html(html);
			}
		},
		msg: {
			updateFailed: function(){
				var canvas = document.getElementById('attempts'),
					context = canvas.getContext('2d'),
					msg = 'Failed Attempts: ' + failed_attempts
				;
				if(game_over === true)
				{

					if(failed_attempts === 0){
						msg = 'No Failed Attempts, You are an expert!';
					}else if(failed_attempts <= 10){
						msg = failed_attempts + ' Failed Attempts, Great memory!';
					}else if(failed_attempts > 10 && failed_attempts <= 20){
						msg = failed_attempts + ' Failed Attempts, You need practice!';
					}else if(failed_attempts > 20){
						console.log('more than 10');
						msg = failed_attempts + ' Failed Attempts, Your memory needs caffeine!';
					}

				}
				console.log(msg);
				//context.clearRect(0, 0, canvas.height, canvas.width);
				//clear the canvas
				canvas.width = canvas.width;

				context.fillStyle = "#ff0000";
				context.font = "bold 16px Arial";
				context.fillText(msg, 10, 15);
				//$('#attempts').text('Failed Attempts: ' + failed_attempts);
			}
		},
		utils: {
			createArray: function(limit){
				var array = [];
				for(var n = 1; n<=2; n++){
					//loop twice so that there is 2 of each card
					for(var i=1; i<=limit; i++){
						array.push(i);
					}
				}
				return memory.utils.shuffleArray(array);
			},
			shuffleArray:
				// Jonas Raoni Soares Silva
				// http://jsfromhell.com/array/shuffle [v1.0]
				function(o){ //v1.0
					for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
					console.log(o);
					return o;
			},
			isMobile: function(){
				return navigator.userAgent.match(/Android/i)
					|| navigator.userAgent.match(/iPhone|iPad|iPod/i)
					|| navigator.userAgent.match(/Opera Mini/i);
			},
			updateTimer: function(){
				var seconds = 0,
					$spantimer = $('span.timer')
				;

				timer = setInterval(function() {
					seconds = seconds + 1;
					//console.log(seconds);
					$spantimer.text(memory.utils.getTime(seconds));
				}, 1000);

			},
			getTime: function(sec) {

					function add_prefix(num) {
						return ( num < 10 ? "0" : "" ) + num;
					}

					var h = Math.floor(sec / 3600);
					sec = sec % 3600;

					var m = Math.floor(sec / 60);
					sec = sec % 60;

					var s = Math.floor(sec);

					return add_prefix(h) + ":" + add_prefix(m) + ":" + add_prefix(s);

			}
		}
	}

}();

$(document).ready(function(){
	memory.init();
});