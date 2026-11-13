<?php

use App\Models\User;
use Laravel\Fortify\Features;

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post(route('login.store'), [
        'login' => '  '.strtoupper($user->email).'  ',
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->withTwoFactor()->create();

    $response = $this->post(route('login'), [
        'login' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'login' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('home'));

    $this->assertGuest();
});

test('users are rate limited', function () {
    $user = User::factory()->create();

    foreach (range(1, 5) as $attempt) {
        $this->post(route('login.store'), [
            'login' => $user->email,
            'password' => 'wrong-password',
        ])->assertSessionHasErrors('login');
    }

    $response = $this->post(route('login.store'), [
        'login' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});

test('users can authenticate using a case insensitive username', function () {
    $user = User::factory()->create(['username' => 'ledger.user']);

    $this->post(route('login.store'), [
        'login' => '  LEDGER.USER  ',
        'password' => 'password',
    ])->assertRedirect(route('dashboard', absolute: false));

    $this->assertAuthenticatedAs($user);
});

test('email identifiers do not fall back to username matching', function () {
    $user = User::factory()->create(['username' => 'ledger-user']);

    $this->post(route('login.store'), [
        'login' => 'ledger-user@invalid.test',
        'password' => 'password',
    ])->assertSessionHasErrors('login');

    $this->assertGuest();
});

test('passkey login options remain available', function () {
    $this->getJson(route('passkey.login-options'))
        ->assertOk()
        ->assertJsonStructure(['options']);
});

test('unknown users and wrong passwords receive the same generic error', function () {
    $user = User::factory()->create();

    $knownResponse = $this->from(route('login'))->post(route('login.store'), [
        'login' => $user->email,
        'password' => 'wrong-password',
    ]);

    $unknownResponse = $this->from(route('login'))->post(route('login.store'), [
        'login' => 'missing@example.com',
        'password' => 'wrong-password',
    ]);

    $knownResponse->assertSessionHasErrors(['login' => trans('auth.failed')]);
    $unknownResponse->assertSessionHasErrors(['login' => trans('auth.failed')]);
});
