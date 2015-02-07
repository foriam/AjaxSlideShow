<?php 
//Initial slide to load is 1, except the slide number is set in the url variables
if ($_GET[$nameOfPresentation]) {
	$slideNumber = $_GET[$nameOfPresentation];
} else {
	$slideNumber = 1;
}

?>
<link rel="stylesheet" type="text/css" href="/AjaxSlideShow/presentation.css" />
<script type="text/javascript" src="/AjaxSlideShow/presentation.js"></script>

<div class="presentation-frame <?php 
	if (isset($presentationFrame) && $presentationFrame == true) {
		echo 'presentation-frameSh';
	}
?> container" id="<?=$nameOfPresentation?>">
	<div class="presentation" onmouseover="PRESENTATIONS['focus'] = '<?=$nameOfPresentation?>';" onmouseout="delete PRESENTATIONS['focus'];">	
		<div class="presentation-box" id="<?=$nameOfPresentation?>-box" style="">
			<div class="presentation-buttons-box">
				<div id="<?=$nameOfPresentation?>-buttons" class="presentation-buttons" style="width: <?php echo ($numberOfSlides * 2)?>em">
					<?php 
					for ($i = 1; $i <= $numberOfSlides; $i++) {
					
						echo '<div class="presentation-button" onclick="';
						echo 'PRESENTATIONS.'.$nameOfPresentation.'.load('.$i.');">';
						echo '</div>';
					}
					?>
					<div style="clear: both;"> </div>
				</div>
			</div>
			<div class="presentation-content" id="<?=$nameOfPresentation?>-pres">
			</div>
		</div>
		<div class="goBack presentation-arrow"  id="<?=$nameOfPresentation?>-back" onclick="PRESENTATIONS.<?=$nameOfPresentation?>.previous();">
			<span>&#171</span>
		</div>
		<div class="goForward presentation-arrow" id="<?=$nameOfPresentation?>-forward" onclick="PRESENTATIONS.<?=$nameOfPresentation?>.next();">
			<span>&#187</span>
		</div>
		<div id="<?=$nameOfPresentation?>-caption" class="presentation-captions" style="min-height: <?=$captionBoxHeight?>em">
			
			<div class="<?=$nameOfPresentation?>-caption caption">
			</div>
			
		</div>
	</div>
</div> 
<script type="text/javascript">	 
	PRESENTATIONS.<?=$nameOfPresentation?> = new Presentation(
		'<?=$nameOfPresentation?>',
		'<?=$imagePath?>/<?=$nameOfPresentation?>/<?=$imageNameRoot?>',
		'<?=$imageType?>',
		<?=$numberOfSlides?>
	);
	PRESENTATIONS.<?=$nameOfPresentation?>.load(<?=$slideNumber?>);
</script>
