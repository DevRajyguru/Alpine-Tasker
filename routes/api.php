<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\AuthOtpController;
use App\Http\Controllers\Api\V1\CookieConsentController;
use App\Http\Controllers\Api\V1\CouponController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\DisputeController;
use App\Http\Controllers\Api\V1\DisputeMessageController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\SearchEventController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\TaskApplicationController;
use App\Http\Controllers\Api\V1\TaskAssignmentController;
use App\Http\Controllers\Api\V1\TaskActualCostController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\TaskPhotoController;
use App\Http\Controllers\Api\V1\TaskerController;
use App\Http\Controllers\Api\V1\TaskerProfileController;
use App\Http\Controllers\Api\V1\TaskerPayoutController;
use App\Http\Controllers\Api\V1\TaskStatusController;
use App\Http\Controllers\Api\V1\Admin\AdminCouponController;
use App\Http\Controllers\Api\V1\Admin\AdminDisputeController;
use App\Http\Controllers\Api\V1\Admin\AdminServiceController;
use App\Http\Controllers\Api\V1\Admin\AdminServiceFieldController;
use App\Http\Controllers\Api\V1\Admin\AdminTransactionController;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\Admin\BackgroundCheckAdminController;
use App\Http\Controllers\Api\V1\Admin\CommissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/otp/send', [AuthOtpController::class, 'send']);
    Route::post('/auth/otp/verify', [AuthOtpController::class, 'verify']);
    Route::post('/cookie-consents', [CookieConsentController::class, 'store']);
    Route::post('/search-events', [SearchEventController::class, 'store']);
    Route::post('/webhooks/stripe', [PaymentController::class, 'webhook']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/cookie-consents', [CookieConsentController::class, 'store']);

        Route::middleware('cookie.consent')->group(function (): void {
            Route::get('/tasks', [TaskController::class, 'index']);
            Route::get('/tasks/{task}', [TaskController::class, 'show']);
            Route::get('/categories', [CategoryController::class, 'index']);
            Route::get('/tasks/{task}/photos', [TaskPhotoController::class, 'index']);
            Route::get('/services', [ServiceController::class, 'index']);
            Route::get('/services/{service}', [ServiceController::class, 'show']);
            Route::get('/taskers', [TaskerController::class, 'index']);
            Route::get('/taskers/{tasker}/reviews', [ReviewController::class, 'taskerReviews']);
            Route::get('/disputes', [DisputeController::class, 'index']);
            Route::get('/disputes/{dispute}', [DisputeController::class, 'show']);
            Route::post('/disputes', [DisputeController::class, 'store']);
            Route::post('/disputes/{dispute}/messages', [DisputeMessageController::class, 'store']);

            Route::middleware('role:customer')->group(function (): void {
                Route::post('/tasks', [TaskController::class, 'store']);
                Route::put('/tasks/{task}', [TaskController::class, 'update']);
                Route::post('/tasks/{task}/cancel', [TaskController::class, 'cancel']);
                Route::post('/tasks/{task}/assign/{tasker}', [TaskAssignmentController::class, 'assign']);
                Route::get('/tasks/{task}/otp', [TaskAssignmentController::class, 'getCustomerOtp']);
                Route::post('/tasks/{task}/otp/regenerate', [TaskAssignmentController::class, 'regenerateCustomerOtp']);
                Route::post('/tasks/{task}/close', [TaskStatusController::class, 'close']);
                Route::post('/tasks/{task}/confirm-completion', [TaskStatusController::class, 'confirmCompletion']);
                Route::post('/tasks/{task}/actual-cost/approve', [TaskActualCostController::class, 'approve']);
                Route::post('/tasks/{task}/photos/customer', [TaskPhotoController::class, 'storeCustomerPhoto']);
                Route::post('/tasks/{task}/review', [ReviewController::class, 'store']);
                Route::put('/tasks/{task}/review', [ReviewController::class, 'update']);
                Route::post('/payments/tasks/{task}/authorize', [PaymentController::class, 'authorizePayment']);
                Route::post('/payments/tasks/{task}/pay-after-service', [PaymentController::class, 'payAfterService']);
                Route::post('/payments/{payment}/capture', [PaymentController::class, 'capture']);
                Route::post('/payments/{payment}/refund', [PaymentController::class, 'refund']);
                Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);
            });

            Route::middleware('role:tasker')->group(function (): void {
                Route::get('/tasker/profile', [TaskerProfileController::class, 'show']);
                Route::put('/tasker/profile', [TaskerProfileController::class, 'upsert']);
                Route::post('/tasker/stripe/connect', [TaskerProfileController::class, 'createStripeConnectAccount']);
                Route::post('/tasker/stripe/refresh-status', [TaskerProfileController::class, 'refreshStripeConnectStatus']);
                Route::get('/tasker/payouts', [TaskerPayoutController::class, 'index']);
                Route::post('/tasks/{task}/apply', [TaskApplicationController::class, 'store']);
                Route::post('/tasks/{task}/accept-fixed', [TaskApplicationController::class, 'acceptFixedPrice']);
                Route::post('/tasks/{task}/actual-cost', [TaskActualCostController::class, 'submit']);
                Route::post('/tasks/{task}/start', [TaskStatusController::class, 'start']);
                Route::post('/tasks/{task}/otp/verify-start', [TaskStatusController::class, 'verifyOtpAndStart']);
                Route::post('/tasks/{task}/complete', [TaskStatusController::class, 'complete']);
                Route::post('/tasks/{task}/photos/completion', [TaskPhotoController::class, 'storeCompletionPhoto']);
            });

            Route::prefix('/admin')->middleware('role:admin')->group(function (): void {
                Route::apiResource('/services', AdminServiceController::class);
                Route::get('/users', [AdminUserController::class, 'index']);
                Route::post('/users/{user}/status', [AdminUserController::class, 'updateStatus']);
                Route::get('/transactions', [AdminTransactionController::class, 'index']);
                Route::get('/services/{service}/fields', [AdminServiceFieldController::class, 'index']);
                Route::post('/services/{service}/fields', [AdminServiceFieldController::class, 'store']);
                Route::put('/services/{service}/fields/{field}', [AdminServiceFieldController::class, 'update']);
                Route::delete('/services/{service}/fields/{field}', [AdminServiceFieldController::class, 'destroy']);
                Route::post('/services/{service}/fields/reorder', [AdminServiceFieldController::class, 'reorder']);
                Route::apiResource('/coupons', AdminCouponController::class);
                Route::get('/disputes', [AdminDisputeController::class, 'index']);
                Route::post('/disputes/{dispute}/status', [AdminDisputeController::class, 'updateStatus']);
                Route::get('/background-checks', [BackgroundCheckAdminController::class, 'index']);
                Route::post('/background-checks/{tasker}/request', [BackgroundCheckAdminController::class, 'requestCheck']);
                Route::post('/background-checks/{backgroundCheck}/status', [BackgroundCheckAdminController::class, 'updateStatus']);
                Route::get('/commissions', [CommissionController::class, 'index']);
                Route::post('/commissions', [CommissionController::class, 'store']);
            });
        });
    });
});
