import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {useForm} from '@tanstack/react-form'
import {
  createFileRoute,
  Link,
  Navigate,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import {zodValidator} from '@tanstack/zod-form-adapter'
import {useMutation} from '@tanstack/react-query'
import {api} from '@/lib/api'
import FieldInfo from '@/components/utils/fieldInfo'
import {z} from 'zod'
import React from 'react'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginComponent,
})

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

function LoginComponent() {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: loginUserSchema,
    },
    onSubmit: async ({value}) => {
      await loginUserMutation.mutateAsync({
        form: {
          email: value.email,
          password: value.password,
        },
      })
    },
  })

  const $login = api.auth.login.$post

  const navigate = Route.useNavigate()

  const loginUserMutation = useMutation({
    mutationFn: $login,
    onSuccess: () => {
      navigate({
        to: '/',
      })
      router.invalidate()
    },
  })

  const {auth, isAuthenticated} = Route.useRouteContext({
    select: ({auth}) => ({auth, isAuthenticated: auth.isAuthenticated}),
  })

  const search = Route.useSearch()

  React.useLayoutEffect(() => {
    if (isAuthenticated === true && search.redirect) {
      router.history.push(search.redirect)
    }
  }, [isAuthenticated, search.redirect])

  return auth.isAuthenticated ? (
    <Navigate to="/" />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
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
          <div className="space-y-2">
            {loginUserMutation.isError && (
              <div className="text-red-500">
                {loginUserMutation.error.message}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Link
              to="/register"
              className="text-blue-400 hover:underline hover:text-blue-600"
            >
              Register
            </Link>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}
