import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrgTransactionController::index
 * @see app/Http/Controllers/OrgTransactionController.php:15
 * @route '/organizations/{organization}/transactions'
 */
export const index = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/organizations/{organization}/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrgTransactionController::index
 * @see app/Http/Controllers/OrgTransactionController.php:15
 * @route '/organizations/{organization}/transactions'
 */
index.url = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { organization: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.slug
                : args.organization,
                }

    return index.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgTransactionController::index
 * @see app/Http/Controllers/OrgTransactionController.php:15
 * @route '/organizations/{organization}/transactions'
 */
index.get = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrgTransactionController::index
 * @see app/Http/Controllers/OrgTransactionController.php:15
 * @route '/organizations/{organization}/transactions'
 */
index.head = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrgTransactionController::index
 * @see app/Http/Controllers/OrgTransactionController.php:15
 * @route '/organizations/{organization}/transactions'
 */
    const indexForm = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrgTransactionController::index
 * @see app/Http/Controllers/OrgTransactionController.php:15
 * @route '/organizations/{organization}/transactions'
 */
        indexForm.get = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrgTransactionController::index
 * @see app/Http/Controllers/OrgTransactionController.php:15
 * @route '/organizations/{organization}/transactions'
 */
        indexForm.head = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\OrgTransactionController::create
 * @see app/Http/Controllers/OrgTransactionController.php:54
 * @route '/organizations/{organization}/transactions/create'
 */
export const create = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/organizations/{organization}/transactions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrgTransactionController::create
 * @see app/Http/Controllers/OrgTransactionController.php:54
 * @route '/organizations/{organization}/transactions/create'
 */
create.url = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { organization: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.slug
                : args.organization,
                }

    return create.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgTransactionController::create
 * @see app/Http/Controllers/OrgTransactionController.php:54
 * @route '/organizations/{organization}/transactions/create'
 */
create.get = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrgTransactionController::create
 * @see app/Http/Controllers/OrgTransactionController.php:54
 * @route '/organizations/{organization}/transactions/create'
 */
create.head = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrgTransactionController::create
 * @see app/Http/Controllers/OrgTransactionController.php:54
 * @route '/organizations/{organization}/transactions/create'
 */
    const createForm = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrgTransactionController::create
 * @see app/Http/Controllers/OrgTransactionController.php:54
 * @route '/organizations/{organization}/transactions/create'
 */
        createForm.get = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrgTransactionController::create
 * @see app/Http/Controllers/OrgTransactionController.php:54
 * @route '/organizations/{organization}/transactions/create'
 */
        createForm.head = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\OrgTransactionController::store
 * @see app/Http/Controllers/OrgTransactionController.php:74
 * @route '/organizations/{organization}/transactions'
 */
export const store = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/transactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrgTransactionController::store
 * @see app/Http/Controllers/OrgTransactionController.php:74
 * @route '/organizations/{organization}/transactions'
 */
store.url = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { organization: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.slug
                : args.organization,
                }

    return store.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgTransactionController::store
 * @see app/Http/Controllers/OrgTransactionController.php:74
 * @route '/organizations/{organization}/transactions'
 */
store.post = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrgTransactionController::store
 * @see app/Http/Controllers/OrgTransactionController.php:74
 * @route '/organizations/{organization}/transactions'
 */
    const storeForm = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrgTransactionController::store
 * @see app/Http/Controllers/OrgTransactionController.php:74
 * @route '/organizations/{organization}/transactions'
 */
        storeForm.post = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\OrgTransactionController::destroy
 * @see app/Http/Controllers/OrgTransactionController.php:98
 * @route '/organizations/{organization}/transactions/{transaction}'
 */
export const destroy = (args: { organization: string | number | { slug: string | number }, transaction: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, transaction: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/organizations/{organization}/transactions/{transaction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrgTransactionController::destroy
 * @see app/Http/Controllers/OrgTransactionController.php:98
 * @route '/organizations/{organization}/transactions/{transaction}'
 */
destroy.url = (args: { organization: string | number | { slug: string | number }, transaction: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, transaction: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                    transaction: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.slug
                : args.organization,
                                transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return destroy.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgTransactionController::destroy
 * @see app/Http/Controllers/OrgTransactionController.php:98
 * @route '/organizations/{organization}/transactions/{transaction}'
 */
destroy.delete = (args: { organization: string | number | { slug: string | number }, transaction: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, transaction: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OrgTransactionController::destroy
 * @see app/Http/Controllers/OrgTransactionController.php:98
 * @route '/organizations/{organization}/transactions/{transaction}'
 */
    const destroyForm = (args: { organization: string | number | { slug: string | number }, transaction: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, transaction: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrgTransactionController::destroy
 * @see app/Http/Controllers/OrgTransactionController.php:98
 * @route '/organizations/{organization}/transactions/{transaction}'
 */
        destroyForm.delete = (args: { organization: string | number | { slug: string | number }, transaction: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, transaction: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const OrgTransactionController = { index, create, store, destroy }

export default OrgTransactionController