

import {z} from 'zod'
const update=z.object({
    body:z.object({
        contactNumber:z.string().optional()
    })
})


export const  adminValidationsSchemas={
update
}