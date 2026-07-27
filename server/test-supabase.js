const supabase = require('./db/supabase');

async function test() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  try {
    // Test 1: Check tables exist
    console.log('1️⃣  Checking if tables exist...');
    const { data: usersCheck, error: usersError } = await supabase
      .from('users')
      .select('count', { count: 'exact' })
      .limit(0);
    
    if (usersError) {
      console.error('❌ Error accessing users table:', usersError.message);
    } else {
      console.log('✅ users table found');
    }

    // Test 2: Check chat_history table
    console.log('\n2️⃣  Checking chat_history table...');
    const { data: chatCheck, error: chatError } = await supabase
      .from('chat_history')
      .select('count', { count: 'exact' })
      .limit(0);
    
    if (chatError) {
      console.error('❌ Error accessing chat_history table:', chatError.message);
    } else {
      console.log('✅ chat_history table found');
    }

    // Test 3: Check chat_messages table
    console.log('\n3️⃣  Checking chat_messages table...');
    const { data: messagesCheck, error: messagesError } = await supabase
      .from('chat_messages')
      .select('count', { count: 'exact' })
      .limit(0);
    
    if (messagesError) {
      console.error('❌ Error accessing chat_messages table:', messagesError.message);
    } else {
      console.log('✅ chat_messages table found');
    }

    // Test 4: Overall connection status
    console.log('\n4️⃣  Overall Status:');
    if (!usersError && !chatError && !messagesError) {
      console.log('✅ ✅ ✅ Connected to Supabase Successfully! 🚀');
      console.log('\n📝 You can now run: npm run dev');
    } else {
      console.log('❌ Some tables are missing. Run the SQL schema in Supabase SQL Editor:');
      console.log('   1. Open server/db/init.sql');
      console.log('   2. Copy all SQL');
      console.log('   3. Paste into Supabase SQL Editor');
      console.log('   4. Execute');
    }
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your .env file has SUPABASE_URL and SUPABASE_KEY');
    console.log('   2. Make sure the values are NOT placeholder text');
    console.log('   3. Verify your Supabase project is running (green status)');
    console.log('   4. Try copying credentials again from Supabase Settings → API');
  }
}

test();
