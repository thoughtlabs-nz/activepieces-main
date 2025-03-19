import { FieldErrors, useForm } from "react-hook-form"
import { useTableState } from "./ap-table-state-provider"
import { t } from "i18next"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FieldHeaderContext } from "../lib/utils"
import { useContext } from "react"


const RenameFieldPopoverContent = ({name}: {name: string}) => {
    const [fields, renameField] = useTableState((state) => [state.fields,state.renameField])
    const fieldHeaderContext = useContext(FieldHeaderContext)
    if(!fieldHeaderContext){
        console.error('FieldHeaderContext not found')
       return null;
    }
    const form = useForm<{name: string}>({
        reValidateMode:'onChange',
        defaultValues: {
            name: name,
        },
        resolver: (values)=>{
            const errors: FieldErrors<{name: string}> = {}
            if(values.name.length === 0){
                errors.name = {
                    message: t('Name is required'),
                    type: 'required',
                }
            }
            if(fields.find((field) => field.name === values.name && field.name !== name)){
                errors.name = {
                    message: t('Name is already taken'),
                    type: 'unique',
                }
            }

            return {
                errors,
                values: Object.keys(errors).length > 0 ? {} : values,
            }
        },
    })
    const onSubmit = (data: {name: string}) => {
       renameField(fieldHeaderContext.field.index,data.name)
       fieldHeaderContext.setIsPopoverOpen(false)
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                 <div className="flex justify-end">
                 <Button type="submit" size='sm' >{t('Rename')}</Button>
                 </div>
            </form>
        </Form>
    )

}

RenameFieldPopoverContent.displayName = 'RenameFieldPopoverContent';
export default RenameFieldPopoverContent;