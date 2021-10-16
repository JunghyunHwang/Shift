using System;
using System.Collections.Generic;

namespace practice
{
    class Program
    {
        static void Main(string[] args)
        {
            Dictionary<string, int> member = new Dictionary<string, int>();

            member["황중현"] = 27;
            member["오현수"] = 23;
            member["김승진"] = 22;

            bool bIsMember = member.ContainsKey("김정현");

            Console.WriteLine(string.Join(" ", member));
            Console.WriteLine(bIsMember);
        }
    }
}