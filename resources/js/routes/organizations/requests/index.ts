import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationMemberController::approve
 * @see app/Http/Controllers/OrganizationMemberController.php:104
 * @route '/organizations/{organization}/requests/{joinRequestId}/approve'
 */
export const approve = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/requests/{joinRequestId}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationMemberController::approve
 * @see app/Http/Controllers/OrganizationMemberController.php:104
 * @route '/organizations/{organization}/requests/{joinRequestId}/approve'
 */
approve.url = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace('{joinRequestId}', parsedArgs.joinRequestId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationMemberController::approve
 * @see app/Http/Controllers/OrganizationMemberController.php:104
 * @route '/organizations/{organization}/requests/{joinRequestId}/approve'
 */
approve.post = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationMemberController::approve
 * @see app/Http/Controllers/OrganizationMemberController.php:104
 * @route '/organizations/{organization}/requests/{joinRequestId}/approve'
 */
    const approveForm = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationMemberController::approve
 * @see app/Http/Controllers/OrganizationMemberController.php:104
 * @route '/organizations/{organization}/requests/{joinRequestId}/approve'
 */
        approveForm.post = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\OrganizationMemberController::reject
 * @see app/Http/Controllers/OrganizationMemberController.php:126
 * @route '/organizations/{organization}/requests/{joinRequestId}/reject'
 */
export const reject = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/requests/{joinRequestId}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationMemberController::reject
 * @see app/Http/Controllers/OrganizationMemberController.php:126
 * @route '/organizations/{organization}/requests/{joinRequestId}/reject'
 */
reject.url = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions) => {
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

    return reject.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace('{joinRequestId}', parsedArgs.joinRequestId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationMemberController::reject
 * @see app/Http/Controllers/OrganizationMemberController.php:126
 * @route '/organizations/{organization}/requests/{joinRequestId}/reject'
 */
reject.post = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationMemberController::reject
 * @see app/Http/Controllers/OrganizationMemberController.php:126
 * @route '/organizations/{organization}/requests/{joinRequestId}/reject'
 */
    const rejectForm = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationMemberController::reject
 * @see app/Http/Controllers/OrganizationMemberController.php:126
 * @route '/organizations/{organization}/requests/{joinRequestId}/reject'
 */
        rejectForm.post = (args: { organization: string | number | { slug: string | number }, joinRequestId: string | number } | [organization: string | number | { slug: string | number }, joinRequestId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const requests = {
    approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
}

export default requests