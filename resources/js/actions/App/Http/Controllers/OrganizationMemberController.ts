import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationMemberController::index
 * @see app/Http/Controllers/OrganizationMemberController.php:15
 * @route '/organizations/{organization}/members'
 */
export const index = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/organizations/{organization}/members',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationMemberController::index
 * @see app/Http/Controllers/OrganizationMemberController.php:15
 * @route '/organizations/{organization}/members'
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
* @see \App\Http\Controllers\OrganizationMemberController::index
 * @see app/Http/Controllers/OrganizationMemberController.php:15
 * @route '/organizations/{organization}/members'
 */
index.get = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationMemberController::index
 * @see app/Http/Controllers/OrganizationMemberController.php:15
 * @route '/organizations/{organization}/members'
 */
index.head = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationMemberController::index
 * @see app/Http/Controllers/OrganizationMemberController.php:15
 * @route '/organizations/{organization}/members'
 */
    const indexForm = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationMemberController::index
 * @see app/Http/Controllers/OrganizationMemberController.php:15
 * @route '/organizations/{organization}/members'
 */
        indexForm.get = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationMemberController::index
 * @see app/Http/Controllers/OrganizationMemberController.php:15
 * @route '/organizations/{organization}/members'
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
* @see \App\Http\Controllers\OrganizationMemberController::update
 * @see app/Http/Controllers/OrganizationMemberController.php:72
 * @route '/organizations/{organization}/members/{member}'
 */
export const update = (args: { organization: string | number | { slug: string | number }, member: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, member: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/organizations/{organization}/members/{member}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\OrganizationMemberController::update
 * @see app/Http/Controllers/OrganizationMemberController.php:72
 * @route '/organizations/{organization}/members/{member}'
 */
update.url = (args: { organization: string | number | { slug: string | number }, member: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, member: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                    member: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.slug
                : args.organization,
                                member: typeof args.member === 'object'
                ? args.member.id
                : args.member,
                }

    return update.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationMemberController::update
 * @see app/Http/Controllers/OrganizationMemberController.php:72
 * @route '/organizations/{organization}/members/{member}'
 */
update.put = (args: { organization: string | number | { slug: string | number }, member: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, member: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\OrganizationMemberController::update
 * @see app/Http/Controllers/OrganizationMemberController.php:72
 * @route '/organizations/{organization}/members/{member}'
 */
    const updateForm = (args: { organization: string | number | { slug: string | number }, member: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, member: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationMemberController::update
 * @see app/Http/Controllers/OrganizationMemberController.php:72
 * @route '/organizations/{organization}/members/{member}'
 */
        updateForm.put = (args: { organization: string | number | { slug: string | number }, member: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, member: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\OrganizationMemberController::destroy
 * @see app/Http/Controllers/OrganizationMemberController.php:90
 * @route '/organizations/{organization}/members/{member}'
 */
export const destroy = (args: { organization: string | number | { slug: string | number }, member: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, member: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/organizations/{organization}/members/{member}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrganizationMemberController::destroy
 * @see app/Http/Controllers/OrganizationMemberController.php:90
 * @route '/organizations/{organization}/members/{member}'
 */
destroy.url = (args: { organization: string | number | { slug: string | number }, member: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, member: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                    member: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.slug
                : args.organization,
                                member: typeof args.member === 'object'
                ? args.member.id
                : args.member,
                }

    return destroy.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationMemberController::destroy
 * @see app/Http/Controllers/OrganizationMemberController.php:90
 * @route '/organizations/{organization}/members/{member}'
 */
destroy.delete = (args: { organization: string | number | { slug: string | number }, member: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, member: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OrganizationMemberController::destroy
 * @see app/Http/Controllers/OrganizationMemberController.php:90
 * @route '/organizations/{organization}/members/{member}'
 */
    const destroyForm = (args: { organization: string | number | { slug: string | number }, member: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, member: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationMemberController::destroy
 * @see app/Http/Controllers/OrganizationMemberController.php:90
 * @route '/organizations/{organization}/members/{member}'
 */
        destroyForm.delete = (args: { organization: string | number | { slug: string | number }, member: string | number | { id: string | number } } | [organization: string | number | { slug: string | number }, member: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\OrganizationMemberController::approveRequest
 * @see app/Http/Controllers/OrganizationMemberController.php:104
 * @route '/organizations/{organization}/requests/{joinRequestId}/approve'
 */
export const approveRequest = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveRequest.url(args, options),
    method: 'post',
})

approveRequest.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/requests/{joinRequestId}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationMemberController::approveRequest
 * @see app/Http/Controllers/OrganizationMemberController.php:104
 * @route '/organizations/{organization}/requests/{joinRequestId}/approve'
 */
approveRequest.url = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                    joinRequestId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.slug
                : args.organization,
                                joinRequestId: args.joinRequestId,
                }

    return approveRequest.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace('{joinRequestId}', parsedArgs.joinRequestId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationMemberController::approveRequest
 * @see app/Http/Controllers/OrganizationMemberController.php:104
 * @route '/organizations/{organization}/requests/{joinRequestId}/approve'
 */
approveRequest.post = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveRequest.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationMemberController::approveRequest
 * @see app/Http/Controllers/OrganizationMemberController.php:104
 * @route '/organizations/{organization}/requests/{joinRequestId}/approve'
 */
    const approveRequestForm = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approveRequest.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationMemberController::approveRequest
 * @see app/Http/Controllers/OrganizationMemberController.php:104
 * @route '/organizations/{organization}/requests/{joinRequestId}/approve'
 */
        approveRequestForm.post = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approveRequest.url(args, options),
            method: 'post',
        })
    
    approveRequest.form = approveRequestForm
/**
* @see \App\Http\Controllers\OrganizationMemberController::rejectRequest
 * @see app/Http/Controllers/OrganizationMemberController.php:126
 * @route '/organizations/{organization}/requests/{joinRequestId}/reject'
 */
export const rejectRequest = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectRequest.url(args, options),
    method: 'post',
})

rejectRequest.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/requests/{joinRequestId}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationMemberController::rejectRequest
 * @see app/Http/Controllers/OrganizationMemberController.php:126
 * @route '/organizations/{organization}/requests/{joinRequestId}/reject'
 */
rejectRequest.url = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                    joinRequestId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.slug
                : args.organization,
                                joinRequestId: args.joinRequestId,
                }

    return rejectRequest.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace('{joinRequestId}', parsedArgs.joinRequestId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationMemberController::rejectRequest
 * @see app/Http/Controllers/OrganizationMemberController.php:126
 * @route '/organizations/{organization}/requests/{joinRequestId}/reject'
 */
rejectRequest.post = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectRequest.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationMemberController::rejectRequest
 * @see app/Http/Controllers/OrganizationMemberController.php:126
 * @route '/organizations/{organization}/requests/{joinRequestId}/reject'
 */
    const rejectRequestForm = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rejectRequest.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationMemberController::rejectRequest
 * @see app/Http/Controllers/OrganizationMemberController.php:126
 * @route '/organizations/{organization}/requests/{joinRequestId}/reject'
 */
        rejectRequestForm.post = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rejectRequest.url(args, options),
            method: 'post',
        })
    
    rejectRequest.form = rejectRequestForm
/**
* @see \App\Http\Controllers\OrganizationMemberController::invite
 * @see app/Http/Controllers/OrganizationMemberController.php:143
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
 * @see app/Http/Controllers/OrganizationMemberController.php:143
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
 * @see app/Http/Controllers/OrganizationMemberController.php:143
 * @route '/organizations/{organization}/invite'
 */
invite.post = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invite.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationMemberController::invite
 * @see app/Http/Controllers/OrganizationMemberController.php:143
 * @route '/organizations/{organization}/invite'
 */
    const inviteForm = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: invite.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationMemberController::invite
 * @see app/Http/Controllers/OrganizationMemberController.php:143
 * @route '/organizations/{organization}/invite'
 */
        inviteForm.post = (args: { organization: string | number | { slug: string | number } } | [organization: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: invite.url(args, options),
            method: 'post',
        })
    
    invite.form = inviteForm
const OrganizationMemberController = { index, update, destroy, approveRequest, rejectRequest, invite }

export default OrganizationMemberController