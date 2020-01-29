---
---
// Dev
var baseUrl = "https://ubqfit-dev-api.augustasoftsol.com/api";
var webURL = "https://ubqfit-dev-website.augustasoftsol.com";
var appBaseURL = "https://ubiquifit-dev.augustasoftsol.com";

var facebookAppId = 378918369494378;
var paypalKey = "AcpqpLU9mJVndYD2ZWZTzvX9RIRit3_PgXC2tqChdesczoelHFAuIKPhPZuKsgXk9tBqyPh3roTY4Hy3";
if (window.location.origin == "https://ubqfit-qa-website.augustasoftsol.com") {
    // QA
    baseUrl = "https://ubqfit-qa-api.augustasoftsol.com/api";
    webURL = "https://ubqfit-qa-website.augustasoftsol.com";
    appBaseURL = "https://ubiquifit-qa.augustasoftsol.com";
}
else if (window.location.origin == "https://ubqfit.com" || window.location.origin == 'https://ubqfitweb.github.io') {
    // Production
    baseUrl = "https://api.ubqfit.com/api";
    webURL = 'https://ubqfit.com';
    appBaseURL = 'https://app.ubqfit.com';
    facebookAppId = 688483668216269;
    paypalKey = "AZJZPrL4L-BscQSYLMUiv_p4vdMYhz6eqV__9ycxDkKMpGK-uVXJzy0fkUa2GybJUOZtuYqp8mn9uoqy";
} else if (window.location.origin == "https://new.ubqfit.com") {
    // Production
    baseUrl = "https://apinew.ubqfit.com/api";
    webURL = 'https://new.ubqfit.com';
    appBaseURL = 'https://appnew.ubqfit.com';
    facebookAppId = 688483668216269;
    paypalKey = "AZJZPrL4L-BscQSYLMUiv_p4vdMYhz6eqV__9ycxDkKMpGK-uVXJzy0fkUa2GybJUOZtuYqp8mn9uoqy";
}

$('.web-login').click(function(){
    window.location.href = appBaseURL;
});



//Paypal
setTimeout(function () {
    if (typeof payPalAction == "function") {
        (function (d, s) {
            var js = d.createElement(s);
            var fjs = d.getElementsByTagName(s)[0];
            js.src = "https://www.paypal.com/sdk/js?client-id=" + paypalKey + "&vault=true";
            js.onload = function () {
                payPalAction();
            };
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script'));
    }
}, 0);

// Get Page Name

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}


// To Get the Page Name

// var path = window.location.pathname;
// var page = path.split("/").pop();

// if (page == 'blog-detail.html') {
//     var blogId = findGetParameter('blog-id');
//     getBlogDetail(blogId);
// } else if (page == 'index.html' || page == '') {
//     getTrendingSections();
//     getInstagramSections();
// } else if (page == 'blog.html') {
//     getBlogList(1);
// } else if (page == 'trainer.html' || page == 'trainee.html' || page == 'busy-mommy.html' || page == 'busy-executive.html') {
//     getInstagramSections();
// }
// else if (page == 'pricing.html') {
//     loadPricing();
// }

// Reimplemented based on Jekyll

var path = window.location.pathname;
var page = path;

if (page == '/blog-detail/index.html' || page == '/ubqfit-marketing/blog-detail/index.html') {
    var blogId = findGetParameter('blog-id');
    getBlogDetail(blogId);
} else if (page == 'index.html' || page == '') {
    getTrendingSections();
    getInstagramSections();
} else if (page == '/blog/' || page == '/ubqfit-marketing/blog/') {
    getBlogList(1);
} else if (page == '/trainer/' || page == '/trainee/' || page == '/busy-mommy/' || page == '/busy-executive/') {
    getInstagramSections();
}
else if (page == '/pricing/' || page == "/ubqfit-marketing/pricing/") {
    loadPricing();
}

// Get Trending Section

function getTrendingSections() {
    $.ajax({
        url: baseUrl + "/Session/TrendingSessionPublic",
        method: "GET",
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function () {
            $("#loading-image").show();
        },
        success: function (data) {
            //console.log('Trending Section', data.content.records);
            $("#loading-image").hide();
            if (typeof data.content.records !== 'undefined') {
                loadTrendingSections(data.content.records);
            } else {
                loadError('trending-section');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error', errorThrown);
        }
    });
}

// Load Trending Section

function loadTrendingSections(trendingData) {
    var html = '';
    $.each(trendingData, function (index, value) {
        if (index < 6) {
            var traineeImageUrl = baseUrl + value.traineeImageUrl + '&token=null';
            var trainerImageUrl = baseUrl + value.trainerImageUrl + '&token=null';
            var traineeImagedata = '';
            var trainerImagedata = '';
            var categoryName = (value.categoryName != null) ? '<h2>' + value.categoryName + '</h2>' : '<h2 style="visibility:hidden;">test</h2>';

            if (value.sessionStatusId == 1) {
                var viewsCount = (value.liveViewsCount != null) ? value.liveViewsCount : 0;
                var bgImage = baseUrl + value.categoryImageUrl + '&token=null';
            } else if (value.sessionStatusId == 3) {
                var viewsCount = (value.totalViewsCount != null) ? value.totalViewsCount : 0;
                var bgImage = baseUrl + value.imageUrl + '&token=null';
            } else {
                var viewsCount = 0;
                var bgImage = 'images/home-banner.png';
            }

            var dateCreated = moment(value.dateCreated).format("MMM D, YYYY");

            if (value.sessionTypeId != 2) {
                var contentBlock = '<div class="trending-block-view" style="cursor:pointer" onclick="goToURL()">' +
                    '<img onerror="loadDefaultImage(this)" data-id="trainer_' + value.id + '" class="left-align" src="' + trainerImageUrl + '">' +
                    '<img onerror="loadDefaultImage(this)" data-id="trainee_' + value.id + '" class="right-align" src="' + traineeImageUrl + '">' +
                    '<h1 id="trainer_' + value.id + '" class="hide left-align side-two text-string black-red-crl"> ' + value.trainerName.charAt(0).toUpperCase() + ' </h1>' +
                    '<h1 id="trainee_' + value.id + '" class="hide right-align side-two text-string black-red-crl"> ' + value.traineeName.charAt(0).toUpperCase() + ' </h1>' +
                    '</div>';
                var sessionNameContent = '<h1>' + value.trainerName + ' x ' + value.traineeName + ' - ' + viewsCount + ' Views</h1>';

            } else {
                var contentBlock = '<div class="trending-block-view">' +
                    '<img class="left-align" src="' + trainerImageUrl + '">' +
                    '</div>';
                var sessionNameContent = '<h1>' + value.trainerName + ' - ' + value.broadcastName + ' - ' + viewsCount + ' Views</h1>';
            }


            html += '<div class="trending-box relative">';
            html += '<div class="width-100">' +
                '<span class="time-stamp">' +
                dateCreated +
                '</span>' +
                '<img class="bg-image" src="' + bgImage + '" width="100%">' +
                '</div>';
            html += '<div class="trending-block">' +
                contentBlock +
                '</div>';
            html += '<div class="tittle-session">' +
                sessionNameContent +
                categoryName +
                '</div>';
            html += '</div>';
        }
    });
    $('.trending-section').html(html);
}

// Get Instagram Section

function getInstagramSections() {
    $.ajax({
        url: baseUrl + "/SocialData/GetInstagramPosts?pageNumber=1&pageSize=10",
        method: "GET",
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function () {
            $("#loading-image").show();
        },
        success: function (data) {
            //console.log('Instagram Sections', data);
            if (typeof data.content.records !== 'undefined') {
                loadInstagram(data.content.records);
            } else {
                loadError('instagram-feed');
            }
            $("#loading-image").hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error', errorThrown);
        }
    });
}

// Load Instagram Section

function loadInstagram(instagram) {
    var html = '';
    $.each(instagram, function (index, value) {
        html += '<div class="instagram-block">';
        if (value.type === 'video') {
            html += '<video class="watcher pointer landscape" poster="' + value.lowResolution_Media_Url + '" width="100%" height="100%" muted playsinline loop preload="auto" autoplay><source src="' + value.standard_Media_Url + '" type="video/mp4" class="landscape">Your browser does not support the video tag.</video>'
        } else {
            html += '<img class="watcher pointer" width="100%" src="' + value.standard_Media_Url + '">';
        }
        html += '<a target="new" href="' + value.instagramLink + '"><span class="instagram-feed-hover"></span></a>';
        html += '</div>';
    });
    $('.wrapper-to-center').html(html);
}


// Load API Error

function loadError(sectionName) {
    var html = '<div class="ajax-error">Error in getting the data! Please try again later.</div>';
    $('.' + sectionName).html(html);
}

// Get Blog Detail

function getBlogDetail(id) {
    $.ajax({
        url: baseUrl + "/Blog/GetBlogWeb?id=" + id,
        method: "GET",
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function () {
            $("#loading-image").show();
        },
        success: function (data) {
            console.log('Blog Detail', data);
            if (typeof data.content !== 'undefined') {
                loadBlogDetail(data.content);
            } else {
                loadError('instagram-feed');
            }
            $("#loading-image").hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error', errorThrown);
        }
    });
}

// Load Blog Detail

function loadBlogDetail(value) {
    var html = '';

    var blogDate = moment(value.dateCreated).format("MMM D, YYYY");
    var blogImage = baseUrl + value.imageUrl + '&token=null';
    html += '<div class="blog-view">' +
        '<div class="blog-top">' +
        '<div class="float-left margin-right-15">' +
        '<img src={{ site.url }}{{ site.baseurl }}/assets/images/profile-img.png>' +
        '</div>' +
        '<h1> UBQFIT </h1>' +
        '<span>' + blogDate + '</span>' +
        '</div>' +
        '<div class="blog-center">' +
        '<a href="javascript:void(0)">' +
        '<img onerror="loadDefaultImage(this)" src="' + blogImage + '" height="200px" width="100%">' +
        '</a>' +
        '<div class="width-100">' +
        '<h4>' +
        value.title +
        '</h4>' +
        '<div class="blog-details-view">' +
        value.message +
        '</div>' +
        '</div>' +
        '<div class="width-100">' +
        '<div class="social-share">' +
        '<h2> Share to: </h2>' +
        '<input type="hidden" id="blog_id_' + value.id + '" value="' + webURL + '/blog-detail.html?blog-id=' + value.id + '">' +
        '<ul>' +
        '<li>' +
        '<a class="fb"  onclick="facebookShare(' + value.id + ')" href="javascript:void(0)">fb</a>' +
        '</li>' +
        '<li>' +
        '<a class="twitter" onclick="twitterShare(' + value.id + ')" href="javascript:void(0)">twitter</a>' +
        '</li>' +
        '<li>' +
        '<a class="linkedin" onclick="linkedInShare(' + value.id + ')" href="javascript:void(0)">linkedin</a>' +
        '</li>' +
        '<li>' +
        '<a class="link tooltip " onclick="copyToClipboard(' + value.id + ')" href="javascript:void(0)">link  <span class="tooltiptext viewtool-' + value.id + '" id="myTooltip">Copied!</span> </a>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'

    $('.blog-post-wrapper').html(html);
}


// Load Default Image

function loadDefaultImage(obj) {
    $(obj).attr('src', 'images/home-banner.png');
}

// Get Blog List
// Blog/AllBlogsWebPublic?pageNumber=2&pageCount=10
function getBlogList(page) {
    $.ajax({
        url: baseUrl + "/Blog/AllBlogsWebPublic?pageNumber=" + page + "&pageCount=12",
        method: "GET",
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function () {
            $("#loading-image").show();
        },
        success: function (data) {
            if (typeof data.content !== 'undefined') {
                if (data.content.length == 0) {
                    $('.no_more').show();
                } else if (data.content.length < 12) {
                    loadBlog(data.content, page);
                    $('.no_more').show();
                    $('#pagination_flag').val(1);
                } else {
                    loadBlog(data.content, page);
                }
            } else {
                loadError('instagram-feed');
            }
            $("#loading-image").hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error', errorThrown);
        }
    });
}

// Load Blog

function loadBlog(blog, page) {
    var html = '';
    $.each(blog, function (index, value) {
        var blogDate = moment(value.dateCreated).format("MMM D, YYYY");
        var blogImage = baseUrl + value.imageUrl + '&token=null';

        html += '<div class="blog-view">' +
            '<div class="blog-top">' +
            '<div class="float-left margin-right-15">' +
            '<img src={{ site.url }}{{ site.baseurl }}/assets/images/profile-img.png>' +
            '</div>' +
            '<h1> UBQFIT </h1>' +
            '<span>' + blogDate + '</span>' +
            '</div>' +
            '<div class="blog-center testclass">' +
            '<a href="{{ site.url }}{{ site.baseurl }}/blog-detail/index.html?blog-id=' + value.id + '">' +
            '<img onerror="loadDefaultImage(this)" src="' + blogImage + '" height="200px" width="100%">' +
            '</a>' +
            '<div class="width-100">' +
            '<h4>' + value.title + '</h4>' +
            '<p>' + value.shortDescription + '</p>' +
            '</div>' +
            '<div class="width-100">' +
            '<div class="social-share">' +
            '<h2> Share to: </h2>' +
            '<input type="hidden" id="blog_id_' + value.id + '" value="' + webURL + '/blog-detail.html?blog-id=' + value.id + '">' +
            '<ul>' +
            '<li>' +
            '<a class="fb"  onclick="facebookShare(' + value.id + ')" href="javascript:void(0)">fb</a>' +
            '</li>' +
            '<li>' +
            '<a class="twitter" onclick="twitterShare(' + value.id + ')" href="javascript:void(0)">twitter</a>' +
            '</li>' +
            '<li>' +
            '<a class="linkedin" onclick="linkedInShare(' + value.id + ')" href="javascript:void(0)">linkedin</a>' +
            '</li>' +
            '<li>' +
            '<a class="link tooltip " onclick="copyToClipboard(' + value.id + ')" href="javascript:void(0)">link  <span class="tooltiptext viewtool-' + value.id + '" id="myTooltip">Copied!</span> </a>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
    });

    if (blog.length < 12) {
        pagination_flag = 1;
    } else {
        pagination_flag = 0;
    }

    $('#page').val(page);

    if (page > 1) {
        $('.blog-section').append(html);
    } else {
        $('.blog-section').html(html);
    }

}


// Get OS

function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
}

// Add OS class to body tag

var userOS = getOS();
$('body').addClass(userOS);


//Social Share

//Facebook share and Messenger customer chat
if (document.body != null) {
    var div = document.createElement('div');
    div.className = 'fb-customerchat';
    div.setAttribute('theme-color', '#df1f26');
    div.setAttribute('page_id', '294775277773956');
    div.setAttribute('ref', '');
    document.body.appendChild(div);
    window.fbMessengerPlugins = window.fbMessengerPlugins || {
        init: function () {
            FB.init({
                appId: facebookAppId,
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v3.3'
            });
        },
        callable: []
    };
    window.fbAsyncInit = window.fbAsyncInit ||
        function () {
            window.fbMessengerPlugins.callable.forEach(function (item) {
                item();
            });
            window.fbMessengerPlugins.init();
        };
    setTimeout(function () {
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, 0);
}


// Facebook Share

function facebookShare(blogId) {
    setTimeout(() => {
        FB.ui({
            method: 'share',
            quote: 'This is ubqfit blog.',
            href: webURL + '/blog-detail.html?blog-id=' + blogId,
            mobile_iframe: true,
            // redirect_uri: environment.appUrl
        }, (response) => {
            if (response && response.error_message) {
                this.toast.sendMessage('Can\'t able to share your post.', this.common.errorToaster);
            } else if (response) {
                this.toast.sendMessage('Content shared successfully.', this.common.successToaster);
            }
            console.log('fb share response', response);
            return;
        });
    }, 100);
}

// Twitter Share

function twitterShare(blogId) {
    const params = `scrollbars=no,resizable=no,status=yes,location=yes,toolbar=no,menubar=no,
        width=600,height=600,left=550,top=200`;
    const url = 'http://twitter.com/share?text=' + 'This is ubqfit blog.' +
        '&url=' + webURL + '/blog-detail.html?blog-id=' + blogId + '&hashtags=ubqfit';
    console.log(url);
    const loginWindow = window.open(url, 'Twitter Share', params);
}

// LinkedInShare

function linkedInShare(blogId) {
    const params = `scrollbars=no,resizable=no,status=yes,location=yes,toolbar=no,menubar=no,
        width=600,height=600,left=550,top=200`;
    const url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + webURL + '/blog-detail.html?blog-id%3D' + blogId +
        '&title=' + 'This is ubqfit blog' + '&source=LinkedIn';
    console.log(url);
    const loginWindow = window.open(url, 'LinkedIn Share', params);
}

// Copy to clipboard

function copyToClipboard(blogId) {
    var copyText = document.getElementById("blog_id_" + blogId);
    copyToClipBoard(copyText.value);
    $('.viewtool-' + blogId).css('visibility', 'visible');
    $('.viewtool-' + blogId).css('opacity', '1');

    setTimeout(function () {
        $('.viewtool-' + blogId).css('visibility', 'hidden');
        $('.viewtool-' + blogId).css('opacity', '0');
    }, 1000);
}

const copyToClipBoard = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};


// /api/PreLaunchRequest/Create

// PreLaunch Request

function submitPreLaunchRequest(data, personasIds) {
    const dataSet = {};
    data.forEach((val) => {
        if (!dataSet[val.name]) {
            dataSet[val.name] = val.value ? val.value.trim() : '';
        }
    });
    const personas = personasIds.map((val) => Number(val));
    var data = {
        "name": dataSet.firstname,
        "firstname": dataSet.firstname,
        "lastname": dataSet.lastname,
        "statusid": 1,
        "email": dataSet.email,
        "phone": dataSet.phone,
        "personas": personas
    }
    $.ajax({
        url: baseUrl + "/PreLaunchRequest/Create",
        method: "POST",
        dataType: "json",
        data: JSON.stringify(data),
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function () {
            $("#loading-image").show();
        },
        success: function (data) {
            console.log('Response data', data);
            $("#loading-image").hide();
            if (data.content == true) {
                // if($('body').hasClass('model-open') == false) {
                $('div.modal-backdrop-prelaunch-two').addClass('model-open');
                $('body').addClass('model-open');
                // } else {
                //     $('div.modal-backdrop-prelaunch-two').removeClass('model-open');
                //     $('body').removeClass('model-open');
                // }
                $('div.modal-backdrop-prelaunch').removeClass('model-open');


            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error', errorThrown);
        }
    });
}
//Donate page - donate.html
function postDonate(postData, details) {
    $("#loader").show();
    let url = baseUrl + "/User/Donate?userid=" + parseInt(postData.userid) + "&amount=" +
        parseFloat(postData.amount) + "&payPalTransactionData=" + JSON.stringify(details) + "&payPalTransactionId=" + details.id;
    if (postData.sessionId && postData.sessionId != 'null') {
        url = url + "&sessionId=" + parseInt(postData.sessionId)
    }
    $.ajax({
        url: url,
        headers: {
            'token': postData.token
        },
        method: "POST",
        dataType: "json",
        data: "",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function () {
            $("#loading-image").show();
        },
        success: function (data) {
            $("#loader").hide();
            if (postData.type == "1") {
                window.location.href = postData.redirectUri + "?status=" + details.status;
            } else {
                window.location.href = "payment-status.html?status=" + details.status;
            }
            localStorage.removeItem("payData");
            $("#loading-image").hide();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#loader").hide();
            console.log('Error', errorThrown);
        }
    });
}
// Post review - testimonials.html
function postReview(postData, rating) {
    var data = {
        "email": postData.reviewEmail,
        "name": postData.reviewName,
        "subject": postData.reviewSubject,
        "review": postData.reviewText,
        "rating": rating + " Star"
    }
    $.ajax({
        url: baseUrl + "/User/SendMailFromClient",
        method: "POST",
        dataType: "json",
        data: JSON.stringify(data),
        crossDomain: true,
        contentType: "application/json-patch+json; charset=utf-8",
        cache: false,
        beforeSend: function () {
            $("#loading-image").show();
        },
        success: function (data) {
            console.log(data);
            if (data.content) {
                reviewform.reset();
                $('div.modal-backdrop').removeClass('model-open');
                $('body').removeClass('model-open');
                $("#loading-image").hide();

                $('div.modal-backdrop-prelaunch-two').addClass('model-open');
                $('body').addClass('model-open');
                $('div.modal-backdrop-prelaunch').removeClass('model-open');
            } else {
                alert("Failed to submit form, Please try again.")
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error', errorThrown);
        }
    });
}
// paid event page join- join-event.html
function postEventJoin(postData, details) {
    $("#loader").show();
    $.ajax({
        url: baseUrl + "/Event/Payment?eventId=" + parseInt(postData.eventid) + "&payPalTransactionStatus=" + details.status + "&payPalTransactionData=" + JSON.stringify(details) + "&payPalTransactionId=" + details.id,
        headers: {
            'token': postData.token
        },
        method: "POST",
        dataType: "json",
        data: "",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function () {
            $("#loading-image").show();
        },
        success: function (data) {
            $("#loader").hide();
            const statusIdContent = data.content ? ('&eventStatusId=' + data.messageCode) : ('&messageCode=' + data.messageCode);
            const urlPrams = "?status=" + details.status + "&eventStatus=" + data.content + statusIdContent;
            if (postData.type == "1") {
                window.location.href = postData.redirectUri + urlPrams;
            } else {
                window.location.href = "event-payment-status.html" + urlPrams;
            }
            localStorage.removeItem("eventPayData");
            $("#loading-image").hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#loader").hide();
            const urlPrams = "?status=" + "ERROR"
            window.location.href = "event-payment-status.html" + urlPrams;
            console.log('Error', errorThrown);
        }
    });
}
var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

function inWords (num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
    return str;
}
//Load pricing 

function loadPricing() {
    $("#loader").show();
    $.ajax({
        url: baseUrl + "/Master/Roles",
        method: "GET",
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function () {
            $("#loading-image").show();
        },
        success: function (data) {
            $("#loader").hide();
            // console.log(data);
            var priceData = data.content;
            console.log(priceData);

            var freeWatcher = data.content.filter(function(number) {
                return number.id == 0;
            });
            var memberWatcher = data.content.filter(function(number) {
                return number.id == 1;
            });
            var traineeWatcher = data.content.filter(function(number) {
                return number.id == 2;
            });
            console.log('freeWatcher', freeWatcher);
            console.log('memberWatcher', memberWatcher);
            console.log('traineeWatcher', traineeWatcher);
            
            $('#freeWatcherPrice').append("$"+freeWatcher[0].price + " / Month");
            $('#memberWatcherPrice').append("$"+memberWatcher[0].price + " / Month");
            $('#traineeWatcherPrice').append("$"+traineeWatcher[0].price + " / Month");

            $('#freeWatcherDiscount').append(freeWatcher[0].discountOnSession + "% Session Discounts");
            $('#memberWatcherDiscount').append(memberWatcher[0].discountOnSession + "% Session Discounts");
            $('#traineeWatcherDiscount').append(traineeWatcher[0].discountOnSession + "% Session Discounts");
            let formatStr = inWords(traineeWatcher[0].freeSessions);
            $('#traineeWatcherPubSession').append(formatStr.charAt(0).toUpperCase() + formatStr.slice(1)+ " free public sessions");
            
            $("#loading-image").hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#loader").hide();
            console.log('Error', errorThrown);
        }
    });
}
function openSignUpModal() {
    window.location.href = appBaseURL; 
}