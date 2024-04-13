import bcryptjs from 'bcryptjs'

export const hashPassword=async(password)=>
{

    try
    {
        const hashedPassword=await bcryptjs.hash(password,10)
        return hashedPassword
    }
    catch(err)
    {
        console.log(err)
    }
}

// export const comparePassword=async(userEnteredPassword,hashedPassword)=>
// {
//     return  bcryptjs.compare(userEnteredPassword, hashedPassword);
// }

