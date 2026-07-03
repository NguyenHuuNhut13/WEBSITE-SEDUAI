<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ContactController;

// Trang chủ
Route::get('/', [CourseController::class, 'home'])->name('home');

// Danh sách khóa học
Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');

// Chi tiết khóa học
Route::get('/courses/{slug}', [CourseController::class, 'show'])->name('courses.show');

// Trang liên hệ
Route::get('/contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactController::class, 'submit'])->name('contact.submit');
