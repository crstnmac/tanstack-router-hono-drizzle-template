import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import FieldInfo from '@/components/utils/fieldInfo'
import {useForm} from '@tanstack/react-form'
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import {zodValidator} from '@tanstack/zod-form-adapter'
import {z} from 'zod'
import {LoaderCircle} from 'lucide-react'
import {fallback, zodSearchValidator} from '@tanstack/router-zod-adapter'
import {postSignup, userQueryOptions} from '@/lib/api'
import {loginSchema, registerSchema} from '@/shared/types'
import {useQueryClient} from '@tanstack/react-query'
import {toast} from 'sonner'

const signupSearchSchema = z.object({
  redirect: fallback(z.string(), '/').default('/'),
})

export const Route = createFileRoute('/auth/register')({
  component: RegisterComponent,
  validateSearch: zodSearchValidator(signupSearchSchema),
  beforeLoad: async ({context, search}) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions())
    if (user) {
      throw redirect({
        to: search.redirect,
      })
    }
  },
})

function RegisterComponent() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      username: '',
      name: '',
      email: '',
      password: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({value}) => {
      const res = await postSignup(
        value.username,
        value.password,
        value.email,
        value.name
      )
      if (res.success) {
        await queryClient.invalidateQueries({queryKey: ['user']})
        router.invalidate()
        window.location.reload()
        await navigate({to: search.redirect})
        return null
      } else {
        if (!res.isFormError) {
          toast.error('Signup failed', {
            description: res.error,
          })
        }
        form.setErrorMap({
          onSubmit: res.isFormError ? res.error : 'Unexpected error',
        })
      }
    },
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">Register</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <form.Field name="username">
              {(field) => (
                <>
                  <Label htmlFor={field.name}>Username</Label>
                  <Input
                    id="username"
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your username"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-2">
            <form.Field name="name">
              {(field) => (
                <>
                  <Label htmlFor={field.name}>Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-2">
            <form.Field name="email">
              {(field) => (
                <>
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your email"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-2">
            <form.Field name="password">
              {(field) => (
                <>
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
          </div>

          <form.Subscribe selector={(state) => [state.errorMap]}>
            {([errorMap]) =>
              errorMap.onSubmit ? (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {typeof errorMap.onSubmit === 'string'
                    ? errorMap.onSubmit
                    : JSON.stringify(errorMap.onSubmit)}
                </p>
              ) : null
            }
          </form.Subscribe>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" className="w-full" disabled={!canSubmit}>
                {isSubmitting && (
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                )}
                Signup
              </Button>
            )}
          </form.Subscribe>

          <div className="space-y-2">
            <Link
              to="/"
              className="text-blue-300 hover:underline hover:text-blue-600"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
