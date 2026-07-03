<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ContactController extends Controller
{
    // Hiển thị trang liên hệ
    public function show()
    {
        return view('contact');
    }

    // Nhận dữ liệu gửi form liên hệ (Mockup)
    public function submit(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'required|string',
        ]);

        // Trả về kèm session flash message thông báo gửi thành công
        return redirect()->back()->with('success', 'Cảm ơn bạn đã liên hệ! SeduAi sẽ phản hồi bạn trong vòng 24 giờ tới.');
    }
}
