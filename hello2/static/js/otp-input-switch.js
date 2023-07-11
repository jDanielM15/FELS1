(function () {
    'use strict';

    $(".single-otp-input").keyup(function () {
        if (this.value.length == this.maxLength) {
          var $next = $(this).next('.single-otp-input');
          if ($next.length)
              $(this).next('.single-otp-input').focus();
          else
              $(this).blur();
        }
    });

})();