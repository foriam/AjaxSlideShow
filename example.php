
<!--Presentation-->
<div style="max-width: 800px">
	<!-- Captions  -->
	<div class="presentation_captions dummy">
		<div>
			Caption for slide 1
		</div>
		<div>
			Caption for slide 2
		</div>
		<div>
			Caption for slide ...
		</div>
	</div>
	<!-- Captions end -->
	<?php 
		$nameOfPresentation = "presentation1";
		
		//Choose the number of slides
		$numberOfSlides = 3;
		
		//Images must be stored in the same path with the following name convention:
		//[imagePath]/[imageNameRoot][slideNumber].[imageType]
		//example: images/presentation1/slide1.png
		$imagePath = "images/presentation1";
		$imageNameRoot = "slide";
		$imageType = "png";
		
		//define the minimum height in em of the box for captions, 0 for auto
		$captionBoxHeight = 0;

		//Choose if a frame should be shown (true/false)
		$presentationFrame = true;
		
		include ('pres/presentation.php');
	?>
</div>
<!--End of presentation-->
