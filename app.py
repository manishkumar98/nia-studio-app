import streamlit as st
import pandas as pd
from datetime import datetime

# --- MANAGEMENT UI CONFIG ---
st.set_page_config(
    page_title="Nia Staff - Kush Nest Management", 
    page_icon="📝", 
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- THEMEING ---
st.markdown("""
    <style>
    [data-testid="stSidebar"] {
        background-color: #0071e3;
        color: white;
    }
    [data-testid="stSidebar"] * {
        color: white !important;
    }
    .stButton>button {
        border-radius: 12px;
        height: 3.5em;
        background-color: #1d1d1f;
        color: white;
        font-weight: bold;
        border: none;
        transition: all 0.2s;
    }
    .stButton>button:hover {
        background-color: #424245;
        color: white;
        transform: translateY(-1px);
    }
    .metric-card {
        background-color: #f5f5f7;
        padding: 24px;
        border-radius: 20px;
        border: 1px solid #e5e7eb;
    }
    .resident-row {
        padding: 15px;
        border-bottom: 1px solid #f0f0f2;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    </style>
    """, unsafe_allow_html=True)

# --- MOCK PERSISTENCE ---
if 'users' not in st.session_state:
    st.session_state.users = [
        {"id": "u1", "name": "Ramesh Kumar", "employeeId": "NIA001", "role": "resident", "balance": 200, "nest": "Kush-12"},
        {"id": "u2", "name": "Priya Sharma", "employeeId": "NIA002", "role": "resident", "balance": 345, "nest": "Kush-12"},
        {"id": "u3", "name": "Arjun Patel", "employeeId": "NIA003", "role": "resident", "balance": 72, "nest": "Kush-12"},
        {"id": "u4", "name": "Sunita Devi", "employeeId": "NIA004", "role": "resident", "balance": 0, "nest": "Kush-12"},
    ]

if 'logs' not in st.session_state:
    st.session_state.logs = []

# --- SIDEBAR & AUTH ---
with st.sidebar:
    st.markdown("# Nia Staff Portal")
    st.markdown("---")
    staff_id = st.text_input("Staff Employee ID", "EAE001")
    if st.button("Logout"):
        st.info("Log out of portal session?")

    st.markdown("---")
    st.markdown("### Quick Shortcuts")
    if st.button("🚀 View Frontend (Vercel)"):
        st.markdown("[Open Resident App](https://nia-studio-app.vercel.app)") # Placeholder

# --- MAIN DASHBOARD ---
st.title("Nest Management Ledger")
st.write(f"Logged in: **Staff {staff_id}** | Nest: **Kush-12**")

tabs = st.tabs(["📝 Manual Ledger", "🏆 Leaderboard", "📊 Analytics", "⚙️ Resident Management"])

with tabs[0]:
    st.header("Daily Award/Deduct")
    st.write("Phase 0 Digital Proxy for Manual Spreadsheets")
    
    col_r, col_l = st.columns([2, 1])
    
    with col_r:
        search = st.text_input("Search Resident Name or ID", "")
        
        for u in st.session_state.users:
            if search.lower() in u['name'].lower() or search.lower() in u['employeeId'].lower():
                with st.expander(f"👤 {u['name']} ({u['employeeId']}) — Current: {u['balance']} pts"):
                    c1, c2 = st.columns(2)
                    with c1:
                        action = st.selectbox("Action Code", [
                            "NEST_MADE (+5)", 
                            "CLEANUP (+3)", 
                            "JAMBO_ATTENDANCE (+10)", 
                            "NEST_NOT_MADE (-3)",
                            "SPITTING (-10)",
                            "SHOUTING (-15)"
                        ], key=f"act_{u['id']}")
                    with c2:
                        note = st.text_input("Optional Note", key=f"note_{u['id']}")
                    
                    if st.button(f"Confirm {u['name']}", key=f"btn_{u['id']}"):
                        points = int(action.split('(')[1].split(')')[0].replace('+', ''))
                        u['balance'] += points
                        st.session_state.logs.insert(0, {
                            "time": datetime.now().strftime("%H:%M:%S"),
                            "resident": u['name'],
                            "action": action.split(' ')[0],
                            "pts": points
                        })
                        st.success(f"Successfully logged {points} pts for {u['name']}")
                        st.rerun()

    with col_l:
        st.subheader("Recent Activity")
        if not st.session_state.logs:
            st.info("No activities logged today yet.")
        else:
            for log in st.session_state.logs[:10]:
                st.markdown(f"**{log['time']}**: {log['resident']} received {log['pts']} pts for {log['action']}")

with tabs[1]:
    st.header("Kush-12 Leaderboard")
    df = pd.DataFrame(st.session_state.users)
    df = df[df['role'] == 'resident'].sort_values(by='balance', ascending=False)
    st.table(df[['name', 'employeeId', 'balance']])

with tabs[2]:
    st.header("Nest Performance Insights")
    c1, c2, c3 = st.columns(3)
    with c1:
        st.metric("Total Residents", len([u for u in st.session_state.users if u['role'] == 'resident']))
    with c2:
        avg = sum(u['balance'] for u in st.session_state.users) / len(st.session_state.users)
        st.metric("Avg Points/Res", f"{avg:.1f}")
    with c3:
        st.metric("Active Nests", "1")
    
    st.markdown("---")
    st.bar_chart(df.set_index('name')['balance'])

with tabs[3]:
    st.header("Onboarding / Offboarding")
    with st.form("add_resident"):
        st.write("Add New Resident to Kush-12")
        new_name = st.text_input("Full Name")
        new_id = st.text_input("Nia ID (e.g. NIA050)")
        if st.form_submit_button("Onboard Resident"):
            st.session_state.users.append({
                "id": f"u{len(st.session_state.users)+1}",
                "name": new_name,
                "employeeId": new_id,
                "role": "resident",
                "balance": 0,
                "nest": "Kush-12"
            })
            st.success(f"Added {new_name} to the Nest database!")
            st.rerun()

st.divider()
st.caption("Nia Backend Management Portal | v1.0.2")
