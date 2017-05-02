/*
 * Background Static Script for Creative Library
 * Internet Billboard a.s.
 * miza
 */
(function() {

	function backgroundDoubleLayer(options, $scope) {
		var layer;

		layer = $scope.makeElement('div')
			.setStyleImportant(getLayerStyle(0));

		// init
		$scope.getDomElement(getTargetElement())
			.onClick(function (e) {
				var targetElement = e.originalEvent.target || e.originalEvent.srcElement;
				if (targetElement === document.body) {
					window.open(options.clickUrl, '_blank');
				}
			})
			.setStyleImportant(getBackgroundStyle())
			.insertAsFirstChild(layer);

		// mouse
		$scope.getDomElement(document.body)
			.onMouseMove(function (e) {
				var offset = 'absolute' == getPosition() ? $scope.getDomElement(getTargetElement()).el.offsetTop : $scope.VisibleArea.getTopInDocumentSpace();
				layer.setStyleImportant(
					getLayerStyle(e.mouseY - offset));
			});

		function getLayerStyle(height) {
			return {
				'position': getPosition(),
				'top': '0px',
				'left': '0',
				'width': '100%',
				'height':  height + 'px',
				'z-index': getZindex(),
				'background-image': getBackgroundImage(options.secondImageUrl),
				'background-position': getBackgroundPosition(),
				'background-attachment': getBackgroundAttachment(),
				'background-size': getBackgroundSize(),
				'background-repeat': getBackgroundRepeat(),
				'transition': 'all 0.2s ease-out'
			};
		}

		function getBackgroundStyle() {
			return {
				'cursor': getPointer(),
				'background-image': getBackgroundImage(options.firstImageUrl),
				'background-position': getBackgroundPosition(),
				'background-attachment': getBackgroundAttachment(),
				'background-size': getBackgroundSize(),
				'background-repeat': getBackgroundRepeat(),
				'transition': 'all 0.2s ease-out'
			};
		}

		function getTargetElement()
		{
			return options.element || document.body;
		}

		function getPosition() {
			return options.position || 'fixed';
		}

		function getZindex() {
			return options.zindex || '-1';
		}

		function getPointer(){
			return options.pointer || 'pointer';
		}

		function getBackgroundImage(url) {
			return 'url(' + url + ')';
		}

		function getBackgroundPosition() {
			return options.background.position || 'center top';
		}

		function getBackgroundAttachment() {
			return options.background.attachment || 'fixed';
		}

		function getBackgroundSize() {
			return options.background.size || 'cover';
		}

		function getBackgroundRepeat() {
			return options.background.repeat || 'no-repeat';
		}
	}

	window.bbCommonLib=window.bbCommonLib||(function(){var c=[],a={},e={},b
			=function(){},x='<script ',y='"><\/script>';function d(f){if(typeof f
			==="string"&&!e[f]){document.write(x+'src="'+f+'" type="text/javascript'
			+y);e[f]=""}}return{extend:function(f){b=f},registerScript:function(g,f)
		{a[g]=f;b(a,c)},registerAd:function(f){var g="bb_"+(""+Math.random()).
				substr(2);f.options.marker=g;document.write(x+'id="'+g+'" type="marker'+
			y);c.push(f);d(f.library);d(f.script);b(a,c)}}})();

	window.bbCommonLib.registerScript('background-double-layer-script-1.01.js', backgroundDoubleLayer);
})();