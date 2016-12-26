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
        duration: $(".js-text-scroll-trigger").height() + $(window).height()
      });

      scrollScene.setTween(timeLine);

      scrollScene.on("progress", function (t) {
        return t.progress <= 0.5 ? $("body").removeClass("mode-green") : $("body").addClass("mode-green");
      });

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

        if (zoomOutScene && zoomOutScene.progress() > 0.99) {
          $(".js-home-background").css({
            visibility: "hidden",
            opacity: 0
          });
        }
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
              return this.target.parent().css("visibility", "hidden");
            },
            onUpdate: function () {
              return this.target.parent().css("visibility", "");
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
            opacity: 0.8
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
          zoomOutScene.setTween(timeLine);
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
        return $(this.triggerElement()).css("visibility", "FORWARD" === t.scrollDirection ? "hidden" : "");
      });

      zoomOutScene.on("enter", function () {
        return $(".js-home-background").css({visibility: "", opacity: ""});
      });

      zoomOutScene.on("leave", function (t) {
        return 0 === t.progress ? $(".js-home-background").css({
            height: "",
            width: ""
          }) : t.progress > 0.9 ? $(".js-home-background").css({visibility: "hidden", opacity: 0}) : void 0;
      });

      zoomOutScene.on("progress", function (t) {
        return $("body").toggleClass("mode-green", t.progress < 0.33333);
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
            x: scrollToWidth,
            ease: Power0.easeNone
          });

          timeLine.add(albumListScroll, 0);

          _sliderWidth = sliderWidth;

          target.each(function () {
            let t;

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
                return coverFlow.css("perspective-origin", coverFlow.prop("perspective") + "% 50%");
              }
            });

            coverFlow.css("perspective-origin", coverFlow.prop("perspective") + "% 50%");

            timeLine.add(jsCoverFlow, 0);

            if (e > 0) {
              listScale = TweenMax.fromTo(element, leftWidth, {
                scaleX: 0.8,
                scaleY: 0.8,
                opacity: 0.6
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
              listScale = TweenMax.fromTo(element, rightWidth, {
                scaleX: 1,
                scaleY: 1,
                opacity: 1
              }, {
                scaleX: 0.8,
                scaleY: 0.8,
                opacity: 0.6,
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
          }) : 1 === t.progress ? $(".js-album-list-fixed").addClass("__ended") : void 0;
      });

      albumListSliderScene.on("enter", function () {
        return $(".js-album-list-fixed").removeClass("__ended");
      });

      let controller = new ScrollMagic.Controller();

      controller.addScene([
        albumListSliderScene,
      ]);
    };

    let imgBackground = function () {
      let imgController = function (e) {
        e.each(function () {
          let element = $(this), liquidKillAt = element.data("liquid-kill-at");
          if (liquidKillAt) {
            element.css("background", '');
            element.find("img").first().css("display", "");
          } else {
            element.imgLiquid();
          }
        });
      };

      $(".js-cover").find("img").on("image.change", function () {
        imgController($(this).closest(".js-cover"));
      });

      imgController($(".js-cover"));
    };

    // let sectionWatcherPlugin = function (t, e) {
    //   t.fn.sectionWatcher = function (i) {
    //     let distance, list, _this = this, windowEl = $(window), bodyEl = $("body"),
    //       jQueryExt = t.extend({}, e, i), p = !1;
    //
    //     this.each(function () {
    //       if (this.hash) {
    //         let element = t(this), i = t(this.hash || document.body);
    //         if (i.length) {
    //           let object = {$anchor: e, $target: i};
    //           list.push(object);
    //           element.on("click", function (i) {
    //             if (bodyEl.hasClass("spy-scrolling")) {
    //               i.preventDefault();
    //               _this.closest(jQueryExt.apply_to_closest).removeClass(jQueryExt.active_class);
    //               element.closest(jQueryExt.apply_to_closest).addClass(jQueryExt.active_class);
    //               bodyEl.addClass("spy-scrolling");
    //               let scrollHeight = Math.abs(windowEl.scrollTop() - object.position),
    //                 scrollHeightCopy = scrollHeight;
    //               scrollHeightCopy -= 0;
    //               scrollHeightCopy *= 3e3;
    //               scrollHeightCopy = Math.max(500, Math.min(3e3, scrollHeightCopy));
    //
    //               $("html,body").animate({scrollTop: object.position + 1}, scrollHeightCopy, function () {
    //                 bodyEl.removeClass("spy-scrolling");
    //                 // s();
    //               });
    //
    //             }
    //           });
    //
    //         }
    //       }
    //     });
    //   }
    // };

    let sectionWatcherPlugin = function (t, e) {
      t.fn.sectionWatcher = function (i) {
        function n() {
          p || (t.each(l, function () {
            "function" == typeof d.scrollto_offset ? this.position = d.scrollto_offset(this.$anchor, this.$target) : "number" == typeof d.scrollto_offset ? this.position = this.$target.offset().top - d.scrollto_offset : this.position = this.$target.offset().top
          }), o(), s())
        }

        function s() {
          if (!p && !h.hasClass("spy-scrolling")) {
            var e, i = c.scrollTop(), n = c.height();
            t.each(l, function (t) {
              n * d.offset_top + i > this.position - 1 && (e = this)
            }), u.not(e && e.$anchor).closest(d.apply_to_closest).removeClass(d.active_class), e ? (e.$anchor.closest(d.apply_to_closest).addClass(d.active_class), e !== a && e.$anchor.trigger("spy.activating")) : e !== a && t(document).trigger("spy.activating"), a = e
          }
        }

        function o() {
          l.sort(function (t, e) {
            return t.position - e.position
          })
        }

        let a, l = [], c = $(window), u = this, h = $("body"), d = t.extend({}, e, i), p = !1;
        this.each(function () {
          if (this.hash) {
            let e = t(this), i = t(this.hash || document.body);
            if (i.length) {
              let n = {$anchor: e, $target: i};
              l.push(n), e.on("click", function (i) {
                if (!h.hasClass("spy-scrolling")) {
                  i.preventDefault(), u.closest(d.apply_to_closest).removeClass(d.active_class), e.closest(d.apply_to_closest).addClass(d.active_class), h.addClass("spy-scrolling");
                  let r = Math.abs(c.scrollTop() - n.position), o = 500, a = 3e3, l = 0, p = 3e3, f = r;
                  f -= l, f *= a, f /= p, f = Math.max(o, Math.min(p, f)), t("html,body").animate({scrollTop: n.position + 1}, f, function () {
                    h.removeClass("spy-scrolling"), s()
                  })
                }
              })
            }
          }
        }), o(), $(window).on("resize", n), $(document).on("scroll", s), n();
        let f = {
          recalc: n, deactivate: function () {
            p = !0
          }, activate: function () {
            p = !1
          }
        };
        return this.data("sectionWatcher", f), this
      }
    };


    let sectionWatcher = function () {


      let sectionWatcherMain, sectionWatcherExtend;

      sectionWatcherMain = function () {
        let sectionWatcherPlugin;

        this.init();
        this.onScroll();

        $(document).on("scroll", $.proxy(this.onScroll, this));
        sectionWatcherPlugin = $(".js-scroll-spy").data("sectionWatcher");

        if (sectionWatcherPlugin) {
          sectionWatcherPlugin.recalc();
        }
      };

      sectionWatcherExtend = {
        init: function () {
          this.$sidemenu = $(".js-side-menu");
          this.menu_visible = !1;

          $(document).on("spy.activating", function (e) {
            let targetInnerText, spyCurrent, spyCurrentCopy, timeline;

            if (e.target === document) {
              targetInnerText = "";
            } else {
              targetInnerText = e.target.innerText;
            }

            spyCurrent = $(".js-scroll-spy-current");

            if ($(".js-scroll-spy").parent().length && spyCurrent.length) {
              spyCurrentCopy = spyCurrent.clone().toggleClass("js-scroll-spy-current __js-copy").text(targetInnerText).insertAfter(spyCurrent);

              timeline = new TimelineMax({autoRemoveChildren: !0});

              timeline.fromTo(spyCurrent[0], 0.5, {
                rotationX: "0deg",
                opacity: 1
              }, {
                rotationX: "90deg", opacity: 0
              }, 0);

              timeline.fromTo(spyCurrentCopy[0], 0.5, {
                rotationX: "-90deg",
                opacity: 0
              }, {
                rotationX: "0deg",
                opacity: 1
              }, 0);

              timeline.addCallback(function () {
                spyCurrentCopy.remove();
                spyCurrent.text(targetInnerText).removeAttr("style");
              });
            }
          });

          $(".js-scroll-spy").sectionWatcher();
        },
        onScroll: function () {
          let scrollTop, height;
          scrollTop = $(window).scrollTop();
          height = $(window).height();

          if (this.menu_visible === !1 && scrollTop >= height / 2) {
            this.$sidemenu.stop().fadeIn(300);
            this.menu_visible = !0;

          } else {
            if (this.menu_visible && height / 2 > scrollTop) {
              this.$sidemenu.stop().fadeOut(300);
              this.menu_visible = !1;
            }
          }
        }
      };

      $.extend(sectionWatcherMain.prototype, sectionWatcherExtend);

      new sectionWatcherMain;
    };

    ainmationScene();
    homeBgFade();
    zoomOUt();
    albumSlider();
    imgBackground();
    sectionWatcherPlugin($, {active_class: "spy-active", apply_to_closest: "*", offset_top: .25, scrollto_offset: !1});
    sectionWatcher();
  }
});
