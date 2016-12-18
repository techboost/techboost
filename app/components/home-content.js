import Ember from 'ember';

export default Ember.Component.extend({
  didRender() {
    this._super(...arguments);
    let ainmationScene = function () {
      let timeLine, scrollTop, scrollBottom, scrollScene;

      timeLine = new TimelineMax();
      timeLine.clear();

      scrollTop = TweenMax.to(".js-text-scroll-top", 1, {
        x: "-100%",
        ease: Linear.easeInOut
      });

      scrollBottom = TweenMax.to(".js-text-scroll-bottom", 1, {
        x: "100%",
        ease: Linear.easeInOut
      });

      timeLine.add(scrollTop, 0);
      timeLine.add(scrollBottom, 0);

      let controller = new ScrollMagic.Controller();

      scrollScene = new ScrollMagic.Scene({
        triggerElement: ".js-text-scroll-trigger",
        triggerHook: 1,
        duration:$(".js-text-scroll-trigger").height() + $(window).height()
      });

      scrollScene.setTween(timeLine);

      controller.addScene([
        scrollScene,
      ]);
    };

    let homeBgFade = function () {
      let timeLine, backgroundFade, backgroundScene;

      timeLine = new TimelineMax();
      timeLine.clear();

      backgroundFade = TweenMax.fromTo('.js-home-background-fade', 1, {opacity: 0}, {
        opacity: 0.8,
        ease: Linear.easeInOut
      });
      timeLine.add(backgroundFade, 0);

      let controller = new ScrollMagic.Controller();

      backgroundScene = new ScrollMagic.Scene({
        duration: 2.5 * $(window).height()
      });

      backgroundScene.setTween(timeLine);

      controller.addScene([
        backgroundScene,
      ]);
    };

    let zoomOUt = function () {
      let timeLine, zoomOutSet, zoomOutScene, controler;
      timeLine = new TimelineMax();
      $(document).on("scrollmagic.destroy", function () {
        $(".js-fake-album-info, .js-home-background-fade, .js-zoom-out-fade, .js-zoom-out-trigger").removeAttr("style");
        $(".js-home-background").css({
          height: "",
          width: "",
          visibility: "",
          opacity: ""
        });
      });

      let backGroundHidden = function () {
        $(".js-fake-album-info, .js-home-background-fade, .js-zoom-out-fade, .js-zoom-out-trigger").removeAttr("style");
        $(".js-home-background").css({
          height: "",
          width: "",
          visibility: "",
          opacity: ""
        });
        (null != zoomOutScene ? zoomOutScene.progress() : void 0) > 0.99 ? $(".js-home-background").css({
            visibility: "hidden",
            opacity: 0
        }) : void 0
      };

      zoomOutSet = function () {
        let element, zoomOutFade, albumInfoFake, homeBgSize, homeBgFade;
        timeLine.clear();
        backGroundHidden();
        if ($(".js-zoom-out-trigger").length) {
          element = $(".js-album-list-album").first();

          zoomOutFade = TweenMax.to(".js-zoom-out-fade", 0.5, {
            opacity: 0,
            ease: Power0.linear,
            onComplete: function () {
              return this.target.parent().css("visibility", "hidden")
            },
            onUpdate: function () {
              return this.target.parent().css("visibility", "")
            }
          });

          albumInfoFake = TweenMax.to(".js-fake-album-info", 0.5, {
            opacity: 1,
            ease: Power0.linear
          });

          homeBgSize = TweenMax.to(".js-home-background", 1, {
            width: element.width(),
            height: element.height(),
            ease: Linear.easeInOut
          });

          homeBgFade = TweenMax.fromTo(".js-home-background-fade", 1, {
            opacity: .8
          }, {
            opacity: 0,
            ease: Linear.easeInOut
          });

          timeLine.add(zoomOutFade, 0.5);
          timeLine.add(albumInfoFake, 1);
          timeLine.add(homeBgSize, 0.5);
          timeLine.add(homeBgFade, 0.5);
        }
      };

      $(document).on("resize", function () {
        zoomOutSet();
        if (zoomOutScene) {
          zoomOutScene.setTween(timeLine)
        }
      });

      zoomOutSet();

      zoomOutScene = new ScrollMagic.Scene({
        triggerElement: ".js-zoom-out-trigger",
        triggerHook: 0,
        duration: 1.5 * $(window).height()
      });

      zoomOutScene.setPin(".js-zoom-out-trigger").setTween(timeLine);

      zoomOutScene.on("end", function (t) {
        return $(this.triggerElement()).css("visibility", "FORWARD" === t.scrollDirection ? "hidden" : "")
      });

      zoomOutScene.on("enter", function (t) {
        return $(".js-home-background").css({visibility: "", opacity: ""})
      });

      zoomOutScene.on("leave", function (t) {
        return 0 === t.progress ? $(".js-home-background").css({
            height: "",
            width: ""
          }) : t.progress > .9 ? $(".js-home-background").css({visibility: "hidden", opacity: 0}) : void 0
      });

      zoomOutScene.on("progress", function (t) {
        return $("body").toggleClass("mode-green", t.progress < .33333)
      });

      controler = new ScrollMagic.Controller();

      controler.addScene([
        zoomOutScene,
      ]);
    };

    let albumSlider = function () {
      let timeLine, albumListSliderScene;

      timeLine = new TimelineMax();

      $(document).on("scrollmagic.destroy", function () {
        timeLine.clear();
        $(".js-album-list-fixed").removeClass("__ended");
      });

      let albumListSlider = function () {
        let target, sliderWidth, _sliderWidth, sliderWidthProgress,
          scrollFromWidth, scrollToWidth, scrollDistance, scrollHeight, albumListScroll;
        target = $(".js-album-list-album");
        timeLine.clear();
        if (target.is(":visible")) {
          sliderWidth = $(".js-album-list-slider").width();
          scrollFromWidth = target.first().width() / -2;
          scrollToWidth = -sliderWidth + scrollFromWidth + target.last().width();
          scrollDistance = Math.abs(scrollFromWidth - scrollToWidth);

          albumListScroll = new TweenMax.fromTo(".js-album-list-slider", 1, {
            x: scrollFromWidth,
            ease: Power0.easeNone
          }, {
            x:scrollToWidth,
            ease: Power0.easeNone
          });

          timeLine.add(albumListScroll, 0);

          _sliderWidth = sliderWidth;

          target.each(function () {
            let t;
            t = $(this);
            console.log("sliderWidth%s", sliderWidth - parseInt(t.css("margin-left")));
            console.log("sliderWidth%s", sliderWidth - parseInt(t.css("margin-right")));

            return t = $(this), sliderWidth -= parseInt(t.css("margin-left")), sliderWidth -= parseInt(t.css("margin-right"));

          });

          scrollHeight = 1 / (target.length - 1) * target.length;
          scrollHeight = 1;
          sliderWidthProgress = scrollHeight - (scrollHeight * (_sliderWidth / sliderWidth));

          target.each(function (e) {
            let element, postionLeft, outerWidth, marginLeft, marginRight,
              _sliderWidthProgress, marginLeftWidth, marginRightWidth, sumWidth,
              leftWidth, rightWidth, coverFlow, jsCoverFlow, listScale, albumInfo;

            element = $(this);
            element.css("transform", "scale(1)");

            postionLeft = element.position().left;
            outerWidth = element.outerWidth();
            marginLeft = parseInt(element.css("margin-left"));
            marginRight = parseInt(element.css("margin-right"));


            element.css("transform", "");

            _sliderWidthProgress = outerWidth / _sliderWidth;
            marginLeftWidth = sliderWidthProgress * (marginLeft / (sliderWidth - _sliderWidth));
            marginRightWidth = sliderWidthProgress * (marginRight / (sliderWidth - _sliderWidth));

            sumWidth = (postionLeft + marginLeft + outerWidth / 2 + scrollFromWidth) / scrollDistance;
            leftWidth = _sliderWidthProgress + marginLeftWidth;
            rightWidth = _sliderWidthProgress + marginRightWidth;

            coverFlow = element.find(".js-cover-flow");
            coverFlow.prop("perspective", 70);

            jsCoverFlow = TweenMax.to(coverFlow, 1, {
              perspective: 50,
              autoCSS: !1,
              ease: Linear.easeInOut,
              onUpdate: function () {
                return coverFlow.css("perspective-origin", coverFlow.prop("perspective") + "% 50%")
              }
            });

            coverFlow.css("perspective-origin", coverFlow.prop("perspective") + "% 50%");

            timeLine.add(jsCoverFlow, 0);

            console.log("sumWidth: %s", sumWidth);
            console.log("leftWidth: %s", leftWidth);
            if (e > 0) {
              listScale = TweenMax.fromTo(element, leftWidth, {
                scaleX: .8,
                scaleY: .8,
                opacity: .6
              }, {
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                ease: Power1.easeOut
              });

              albumInfo = TweenMax.fromTo(element.find(".js-album-info"), leftWidth, {
                marginLeft: "-40%"
              }, {
                marginLeft: "0%",
                ease: Linear.easeInOut
              });

              timeLine.add(listScale, sumWidth - leftWidth);
              timeLine.add(albumInfo, sumWidth - leftWidth);
            }

            if (e < target.length - 1) {
              console.log("rightWidth: %s", rightWidth);
              listScale = TweenMax.fromTo(element, rightWidth, {
                scaleX: 1,
                scaleY: 1,
                opacity: 1
              }, {
                scaleX: .8,
                scaleY: .8,
                opacity: .6,
                immediateRender: !1,
                ease: Power1.easeIn
              });

              albumInfo = TweenMax.fromTo(element.find(".js-album-info"), rightWidth, {
                marginLeft: "0%"
              }, {
                marginLeft: "20%",
                immediateRender: !1,
                ease: Linear.easeInOut
              });
              timeLine.add(listScale, sumWidth);
              timeLine.add(albumInfo, sumWidth);
            }
          });
        }
      };

      $(document).on("resize", function () {
        albumListSlider();
        if (albumListSliderScene != null) {
          albumListSliderScene.setTween(timeLine);
        }
      });

      albumListSlider();
      console.log("duration: %s", 500 * $(".js-album-list").find(".js-album-list-album").length);
      albumListSliderScene = new ScrollMagic.Scene({
        triggerElement: ".js-album-list",
        triggerHook: 0,
        duration: 500 * $(".js-album-list").find(".js-album-list-album").length
      });
      albumListSliderScene.setPin(".js-album-list").setTween(timeLine);
      albumListSliderScene.current_tween = timeLine;

      albumListSliderScene.on("leave", function (t) {
        return 0 === t.progress ? $(".js-home-background").css({
            height: "",
            width: ""
          }) : 1 === t.progress ? $(".js-album-list-fixed").addClass("__ended") : void 0
      });

      albumListSliderScene.on("enter", function () {
        return $(".js-album-list-fixed").removeClass("__ended")
      });

      let controller = new ScrollMagic.Controller();

      controller.addScene([
        albumListSliderScene,
      ])

    };

    let imgBackground = function () {
      let imgConctroller = function (e) {
        e.each(function () {
          let element = $(this), liquidKillAt = element.data("liquid-kill-at");
          if (liquidKillAt) {
            element.css("background", '');
            element.find("img").first().css("display", "");
          } else {
            element.imgLiquid()
          }
        })
      };

      $(".js-cover").find("img").on("image.change", function () {
        imgConctroller($(this).closest(".js-cover"))
      });

      imgConctroller($(".js-cover"));

    };

    let responsiveImage = function () {
      let n;
      n = function n(t) {
        this.el = t;
        this.$el = r(t);
        this.media_queries = this.$el.data("src");
        this.current_media = "";
        this.setEvent();
        this.setMedia();
      };

      $("img[data-src]").each(function () {
        new n(this)
      });

      let a = {
        setEvent: function () {
          $(document).on("resize", $.proxy(this.setMedia, this))
        }, setMedia: function () {
          let t = "default", e = this;
          for (let i in this.media_queries)"default" !== i && window.matchMedia(i).matches && (t = i);
          this.current_media !== t && (this.el.onload = function () {
            e.$el.trigger("image.change")
          }, this.el.src = this.media_queries[t], this.current_media = t)
        }
      };

      $.extend(n.property, a);
    };

    ainmationScene();
    homeBgFade();
    zoomOUt();
    albumSlider();
    imgBackground();
    responsiveImage();
  }
});
