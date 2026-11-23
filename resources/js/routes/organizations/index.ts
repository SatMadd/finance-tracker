import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import members from './members'
import requests from './requests'
import transactions from './transactions'
/**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:15
 * @route '/organizations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/organizations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:15
 * @route '/organizations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:15
 * @route '/organizations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:15
 * @route '/organizations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:15
 * @route '/organizations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:15
 * @route '/organizations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:15
 * @route '/organizations'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:43
 * @route '/organizations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/organizations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:43
 * @route '/organizations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:43
 * @route '/organizations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:43
 * @route '/organizations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:43
 * @route '/organizations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\OrganizationController::join
 * @see app/Http/Controllers/OrganizationController.php:129
 * @route '/organizations/join'
 */
export const join = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: join.url(options),
    method: 'post',
})

join.definition = {
    methods: ["post"],
    url: '/organizations/join',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationController::join
 * @see app/Http/Controllers/OrganizationController.php:129
 * @route '/organizations/join'
 */
join.url = (options?: RouteQueryOptions) => {
    return join.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::join
 * @see app/Http/Controllers/OrganizationController.php:129
 * @route '/organizations/join'
 */
join.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: join.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationController::join
 * @see app/Http/Controllers/OrganizationController.php:129
 * @route '/organizations/join'
 */
    const joinForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: join.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::join
 * @see app/Http/Controllers/OrganizationController.php:129
 * @route '/organizations/join'
 */
        joinForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: join.url(options),
            method: 'post',
        })
    
    join.form = joinForm
/**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:66
 * @route '/organizations/{organization}'
 */
export const show = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/organizations/{organization}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:66
 * @route '/organizations/{organization}'
 */
show.url = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:66
 * @route '/organizations/{organization}'
 */
show.get = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:66
 * @route '/organizations/{organization}'
 */
show.head = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:66
 * @route '/organizations/{organization}'
 */
    const showForm = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:66
 * @route '/organizations/{organization}'
 */
        showForm.get = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:66
 * @route '/organizations/{organization}'
 */
        showForm.head = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:104
 * @route '/organizations/{organization}'
 */
export const update = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/organizations/{organization}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:104
 * @route '/organizations/{organization}'
 */
update.url = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:104
 * @route '/organizations/{organization}'
 */
update.put = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:104
 * @route '/organizations/{organization}'
 */
    const updateForm = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:104
 * @route '/organizations/{organization}'
 */
        updateForm.put = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:119
 * @route '/organizations/{organization}'
 */
export const destroy = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/organizations/{organization}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:119
 * @route '/organizations/{organization}'
 */
destroy.url = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:119
 * @route '/organizations/{organization}'
 */
destroy.delete = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:119
 * @route '/organizations/{organization}'
 */
    const destroyForm = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:119
 * @route '/organizations/{organization}'
 */
        destroyForm.delete = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\OrganizationController::regenerateCode
 * @see app/Http/Controllers/OrganizationController.php:168
 * @route '/organizations/{organization}/regenerate-code'
 */
export const regenerateCode = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: regenerateCode.url(args, options),
    method: 'post',
})

regenerateCode.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/regenerate-code',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationController::regenerateCode
 * @see app/Http/Controllers/OrganizationController.php:168
 * @route '/organizations/{organization}/regenerate-code'
 */
regenerateCode.url = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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

    return regenerateCode.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::regenerateCode
 * @see app/Http/Controllers/OrganizationController.php:168
 * @route '/organizations/{organization}/regenerate-code'
 */
regenerateCode.post = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: regenerateCode.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationController::regenerateCode
 * @see app/Http/Controllers/OrganizationController.php:168
 * @route '/organizations/{organization}/regenerate-code'
 */
    const regenerateCodeForm = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: regenerateCode.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::regenerateCode
 * @see app/Http/Controllers/OrganizationController.php:168
 * @route '/organizations/{organization}/regenerate-code'
 */
        regenerateCodeForm.post = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: regenerateCode.url(args, options),
            method: 'post',
        })
    
    regenerateCode.form = regenerateCodeForm
/**
* @see \App\Http\Controllers\OrganizationController::transferOwnership
 * @see app/Http/Controllers/OrganizationController.php:182
 * @route '/organizations/{organization}/transfer-ownership'
 */
export const transferOwnership = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transferOwnership.url(args, options),
    method: 'post',
})

transferOwnership.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/transfer-ownership',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationController::transferOwnership
 * @see app/Http/Controllers/OrganizationController.php:182
 * @route '/organizations/{organization}/transfer-ownership'
 */
transferOwnership.url = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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

    return transferOwnership.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::transferOwnership
 * @see app/Http/Controllers/OrganizationController.php:182
 * @route '/organizations/{organization}/transfer-ownership'
 */
transferOwnership.post = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transferOwnership.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationController::transferOwnership
 * @see app/Http/Controllers/OrganizationController.php:182
 * @route '/organizations/{organization}/transfer-ownership'
 */
    const transferOwnershipForm = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: transferOwnership.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::transferOwnership
 * @see app/Http/Controllers/OrganizationController.php:182
 * @route '/organizations/{organization}/transfer-ownership'
 */
        transferOwnershipForm.post = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: transferOwnership.url(args, options),
            method: 'post',
        })
    
    transferOwnership.form = transferOwnershipForm
/**
* @see \App\Http\Controllers\OrganizationController::leave
 * @see app/Http/Controllers/OrganizationController.php:205
 * @route '/organizations/{organization}/leave'
 */
export const leave = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leave.url(args, options),
    method: 'post',
})

leave.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/leave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationController::leave
 * @see app/Http/Controllers/OrganizationController.php:205
 * @route '/organizations/{organization}/leave'
 */
leave.url = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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

    return leave.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::leave
 * @see app/Http/Controllers/OrganizationController.php:205
 * @route '/organizations/{organization}/leave'
 */
leave.post = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leave.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationController::leave
 * @see app/Http/Controllers/OrganizationController.php:205
 * @route '/organizations/{organization}/leave'
 */
    const leaveForm = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: leave.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::leave
 * @see app/Http/Controllers/OrganizationController.php:205
 * @route '/organizations/{organization}/leave'
 */
        leaveForm.post = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: leave.url(args, options),
            method: 'post',
        })
    
    leave.form = leaveForm
/**
* @see \App\Http\Controllers\OrganizationMemberController::invite
 * @see app/Http/Controllers/OrganizationMemberController.php:139
 * @route '/organizations/{organization}/invite'
 */
export const invite = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invite.url(args, options),
    method: 'post',
})

invite.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/invite',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationMemberController::invite
 * @see app/Http/Controllers/OrganizationMemberController.php:139
 * @route '/organizations/{organization}/invite'
 */
invite.url = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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

    return invite.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationMemberController::invite
 * @see app/Http/Controllers/OrganizationMemberController.php:139
 * @route '/organizations/{organization}/invite'
 */
invite.post = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invite.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationMemberController::invite
 * @see app/Http/Controllers/OrganizationMemberController.php:139
 * @route '/organizations/{organization}/invite'
 */
    const inviteForm = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: invite.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationMemberController::invite
 * @see app/Http/Controllers/OrganizationMemberController.php:139
 * @route '/organizations/{organization}/invite'
 */
        inviteForm.post = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: invite.url(args, options),
            method: 'post',
        })
    
    invite.form = inviteForm
const organizations = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
join: Object.assign(join, join),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
regenerateCode: Object.assign(regenerateCode, regenerateCode),
transferOwnership: Object.assign(transferOwnership, transferOwnership),
leave: Object.assign(leave, leave),
members: Object.assign(members, members),
requests: Object.assign(requests, requests),
invite: Object.assign(invite, invite),
transactions: Object.assign(transactions, transactions),
}

export default organizations