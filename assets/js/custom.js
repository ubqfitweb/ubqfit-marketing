---
---
var personasIds = [];
var intlTelIn;
//Menu Drop down (SubMenu)
$(document).ready(function(){
    $(document).on("click", function(event){
        var $trigger = $(".community");
        if($trigger !== event.target && !$trigger.has(event.target).length){
            $('.submenu').css('display','none');
            $('.community_menu').removeClass('showDropdown');
        } else {
            if($('.community_menu').hasClass('showDropdown') == true) {
                $('.community_menu').removeClass('showDropdown');
                $('.submenu').css('display','none');
            } else {
                $('.submenu').css('display','block');
                $('.community_menu').addClass('showDropdown');
            }
            //alert($('.community_menu').hasClass('showDropdown'));
        }
    });

    $(document).on('click','.mobile-view', function(){
        if($('body').hasClass('mobileMenu') == false) {
            $('div.menumobileview').addClass('mobileMenu');
            $('body').addClass('mobileMenu');
        } else {
            $('div.menumobileview').removeClass('mobileMenu');
            $('body').removeClass('mobileMenu');
        }
    });

    // $(document).on('click','.review_btn', function(){
    //     if($('body').hasClass('model-open') == false) {
    //         $('div.modal-backdrop').addClass('model-open');
    //         $('body').addClass('model-open');
    //     } else {
    //         $('div.modal-backdrop').removeClass('model-open');
    //         $('body').removeClass('model-open');
    //     }
    // });

    $(document).on('click','.review_btn', function(){
        if($('body').hasClass('model-open') == false) {
            $('iframe').attr('src', $('.youtube_video_autoplay').val());
            $('div.modal-backdrop').addClass('model-open');
            $('body').addClass('model-open');
            reviewform.reset();
        } else {
            $('div.modal-backdrop').removeClass('model-open');
            $('body').removeClass('model-open');
        }
    });

    $(document).on('click', '.review_btn_prelaunch', function () {
       // window.location.href = appBaseURL;
        multiSelectChanged()
        if ($('body').hasClass('model-open') == false) {
            $('div.modal-backdrop-prelaunch').addClass('model-open');
            $('body').addClass('model-open');
        } else {
            $('div.modal-backdrop-prelaunch').removeClass('model-open');
            $('body').removeClass('model-open');
        }
    });
    $(document).on('click', '.review_btn_prelaunch_checkit_out', function () {
         window.location.href = appBaseURL;
    });

    $(document).on('click', '.close-btn', function () {
        document.getElementById("newModalForm").reset();
        $('label.error').remove();
        $('div.modal-backdrop-prelaunch').removeClass('model-open');
        $('body').removeClass('model-open');
    });

    $(document).on('click', '.close-btn', function () {
        $('div.modal-backdrop-prelaunch-two').removeClass('model-open');
        $('body').removeClass('model-open');
    });

    // $(document).on('click','.review_btn_prelaunch-two', function(){
    //     if($('body').hasClass('model-open') == false) {
    //         $('div.modal-backdrop-prelaunch-two').addClass('model-open');
    //         $('body').addClass('model-open');
    //     } else {
    //         $('div.modal-backdrop-prelaunch-two').removeClass('model-open');
    //         $('body').removeClass('model-open');
    //     }
    // });

    $(document).on('click','.iframe_close', function(){
        //$('iframe').attr('src', '');
        $('iframe').attr('src', $('.youtube_video').val());
    });

    // Detect OS

    console.log('Platform Name',navigator.platform);

});

$(document).on('click','.help-desk, .helpdesk', function(){
    zE(function () {
        zE.show();
    });
    zE.activate({
      hideOnClose: true
    });
});

zE(function() {
    zE.hide();
});

window['zESettings'] = {
    analytics: true,
    errorReporting: true,
    webWidget: {
        analytics: true,
        errorReporting: true,
        contactOptions: {
            enabled: true,
            chatLabelOnline: {
                '*': 'Live Chat'
            },
            chatLabelOffline: {
                '*': 'Chat with us'
            },
            contactButton: {
                '*': 'Chat with us'
            }
        },
        helpCenter: {
            suppress: true,
            chatButton: {
                '*': 'Live Chat'
            },
            title: {
                '*': 'Search for help',
                // 'fr': 'Recherche d\'aide'
            },
            searchPlaceholder: {
                '*': 'Search our Help Center',
                // 'fr': "Cherchez dans le centre d'aide"
            }
        }
    }
};

$(function () {

    jQuery.validator.addMethod("noSpace", function(value, element) {
        console.log('Validation for space', value.indexOf(" ") < 0 && value != "");

        if(value.trim() == "") {
            return false;
        } else {
            return true;
        }

    }, "No space please and don't leave it empty");


    $("#newModalForm").validate({

        rules: {
            firstname: {
                required: true,
                noSpace: true
            },
            lastname: {
                required: true,
                noSpace: true
            },
            email: {
                required: true,
                email: true,
                noSpace: true
            },
            phone: {
                required: true
            },
            personas: {
                required: true
            },
            other: {
                required: true,
                noSpace: true
            }
        },
        messages: {
            firstname: {
                required: "First Name is required !"
            },
            lastname: {
                required: "Last Name is required !"
            },
            email: {
                required: "Email is required !",
                email: "Invalid Email !"
            },
            phone: {
                required: "Phone no is required !"
            },
            personas: {
                required: "Person is required !"
            },
            other: {
                required: 'Other is required!'
            }
        },
        errorPlacement: function (error, element) {
            console.log('Error', error);
            if (element.attr("type") == "checkbox") {
                //error.insertAfter($(element).parents('div').prev($('.question')));
                error.insertAfter($(element).parents('div.multi-select-check-box'));
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            if (intlTelIn.isValidNumber()) {
                $('.error-phone').remove();
                var serializedData = $('#newModalForm').serializeArray();
                submitPreLaunchRequest(serializedData, personasIds);
            } else {
                if ($('.error-phone').length == 0) {
                    $('<span class="error error-phone">Please enter valid mobile no !</span>').insertAfter('#phoneNumber');
                }
            }
        }

    });


});

// Close Modal Popup
function closeModal(className) {
    $('.' + className).removeClass('model-open');
    $('body').removeClass('model-open');
    $("#newModalForm")[0].reset();
}

function multiSelectChanged(type) {
    personasIds = [];
    $.each($("input[name='personas']:checked"), function () {
        // console.log('value:', $(this).val());
        personasIds.push($(this).val());
    });
    // console.log(type, personasIds);
    const idx = personasIds.findIndex((val) => val === '5');
    if (idx >= 0) {
        $('#otherPersonContainer').addClass('show-container');
    } else {
        $('#otherPersonContainer').removeClass('show-container');
    }
}


// // Phone No Plugin

var input = document.querySelector("#phoneNumber");
intlTelIn = window.intlTelInput(input, {
    utilsScript: "{{ site.url }}{{ site.baseurl }}/assets/js/intl-tel-input/build/js/utils.js",
    initialCountry: 'auto',
    nationalMode: false,
    customPlaceholder: function (selectedCountryPlaceholder, selectedCountryData) {
        return 'Phone Number';
    },
    geoIpLookup: function (callback) {
        $.get('https://ipinfo.io', function () {}, 'jsonp').always(function (resp) {
            const countryCode = (resp && resp.country) ? resp.country : '';
            callback(countryCode);
        });
    },
    allowDropdown: true
});

      // $(document).ready(function() {
        var isMobile = false; //initiate as false
        // device detection
        function openAppView() {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
                .test(navigator.userAgent) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
                .test(navigator.userAgent.substr(0, 4))) {
                isMobile = true;
            }

            // Get Element
            var element = document.getElementById('download-app');
            // Check if device is mobile
            if (isMobile === true) {
                document.getElementsByClassName("download-app")[0].setAttribute("data-is-mobile", "true");

            } else {
                document.getElementsByClassName("download-app")[0].setAttribute("data-is-mobile", "false");
            }
        }
        //});
