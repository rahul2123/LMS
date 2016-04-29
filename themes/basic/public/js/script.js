jQuery(document).ready(function($) {
    window.users = []
    $('.notification').submit(function(event) {
        event.preventDefault()
        var notification = {
            title: $('.title').val(),
            description: $('.description').val()
        }
        $.ajax({
            url: '/admin/create-notification',
            type: 'POST',
            data: notification
        }).done(function(notify) {
            console.log(notify)
        })
    });
    var notid = {}
    if (window.location.pathname === '/admin/notifications') {
        $.ajax({
            url: '/admin/app-users',
            type: 'GET'
        }).done(function(users) {
            var data = users.map(function(el) {
                return {
                    id: el.uid,
                    text: el.email
                }
            })
            $(".app-users").select2({
                data: data
            });
        })
    }
    $('.notifyuser').click(function(event) {
        var that = $(this)
        that.closest('tr').find('.title').text()
        that.closest('tr').find('.description').text()
        // notid = that.attr('data-uid');

        notid = {
            title : that.closest('tr').find('.title').text(),
            description : that.closest('tr').find('.description').text(),
            uid : that.attr('data-uid'),
            status : false
        }
        console.log(notid)

    });

    $('#myModal').on('hidden.bs.modal', function(e) {
        $('.app-users').val(null).trigger('change')
    })

    $('.send-notification').click(function(event) {
        // console.log($('.app-users').val())
        var users = $('.app-users').val()
        var data  = {
                'users': JSON.stringify(users),
                'notid': JSON.stringify(notid)
            }
        $.ajax({
            url: '/admin/send-notification',
            type: 'POST',
            data: data,
        })
            .done(function(status) {
                console.log("success", status);
                $('#myModal').modal('hide')
                alert('added notifications to all selected users')
            })

    });

    if (location.pathname == '/user') {
        $.ajax({
            url: '/get-notification',
            type: 'GET'
        }).done(function(data) {
            console.log("success",data);
            $('.notification').append('<p>You have <a href="/get-notification" title="">'+data.notification_status.length+'</a> Notifications</p>')
        })
    }

});