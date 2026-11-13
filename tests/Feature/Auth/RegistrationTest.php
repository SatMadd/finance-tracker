<?php

use App\Models\User;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'username' => 'Test.User',
        'email' => 'TEST@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $this->assertDatabaseHas('users', [
        'username' => 'Test.User',
        'name' => 'Test.User',
        'email' => 'test@example.com',
    ]);
});

test('registration rejects malformed usernames', function (string $username) {
    $response = $this->post(route('register.store'), [
        'username' => $username,
        'email' => 'new@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('username');
})->with([
    'at sign' => 'bad@name',
    'too short' => 'ab',
    'too long' => str_repeat('a', 31),
    'space' => 'bad name',
]);

test('registration rejects usernames that differ only by case', function () {
    User::factory()->create(['username' => 'ExistingName']);

    $this->post(route('register.store'), [
        'username' => 'existingname',
        'email' => 'new@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('username');
});

test('registration rejects emails that differ only by case', function () {
    User::factory()->create(['email' => 'existing@example.com']);

    $this->post(route('register.store'), [
        'username' => 'new-user',
        'email' => 'EXISTING@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('email');
});
