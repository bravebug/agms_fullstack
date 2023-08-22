from django.shortcuts import redirect


def total_redirect_from_main(request):
    return redirect('/roads/')
