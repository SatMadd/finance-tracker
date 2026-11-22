import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\FinanceSettingsController::edit
 * @see app/Http/Controllers/FinanceSettingsController.php:13
 * @route '/finance-settings'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/finance-settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FinanceSettingsController::edit
 * @see app/Http/Controllers/FinanceSettingsController.php:13
 * @route '/finance-settings'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceSettingsController::edit
 * @see app/Http/Controllers/FinanceSettingsController.php:13
 * @route '/finance-settings'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FinanceSettingsController::edit
 * @see app/Http/Controllers/FinanceSettingsController.php:13
 * @route '/finance-settings'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FinanceSettingsController::edit
 * @see app/Http/Controllers/FinanceSettingsController.php:13
 * @route '/finance-settings'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FinanceSettingsController::edit
 * @see app/Http/Controllers/FinanceSettingsController.php:13
 * @route '/finance-settings'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FinanceSettingsController::edit
 * @see app/Http/Controllers/FinanceSettingsController.php:13
 * @route '/finance-settings'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\FinanceSettingsController::update
 * @see app/Http/Controllers/FinanceSettingsController.php:21
 * @route '/finance-settings'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/finance-settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FinanceSettingsController::update
 * @see app/Http/Controllers/FinanceSettingsController.php:21
 * @route '/finance-settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FinanceSettingsController::update
 * @see app/Http/Controllers/FinanceSettingsController.php:21
 * @route '/finance-settings'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\FinanceSettingsController::update
 * @see app/Http/Controllers/FinanceSettingsController.php:21
 * @route '/finance-settings'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FinanceSettingsController::update
 * @see app/Http/Controllers/FinanceSettingsController.php:21
 * @route '/finance-settings'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const financeSettings = {
    edit: Object.assign(edit, edit),
update: Object.assign(update, update),
}

export default financeSettings