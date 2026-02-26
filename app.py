import streamlit as st
import pandas as pd
from datetime import datetime

# --- CONFIG ---
st.set_page_config(page_title="Nia Studio", page_icon="⚡", layout="wide")

# --- CUSTOM CSS ---
st.markdown("""
    <style>
    .main {
        background-color: #f5f5f7;
    }
    .stButton>button {
        width: 100%;
        border-radius: 12px;
        height: 3em;
        background-color: #0071e3;
        color: white;
        font-weight: bold;
        border: none;
    }
    .stButton>button:hover {
        background-color: #0077ed;
        color: white;
    }
    .card {
        padding: 20px;
        border-radius: 20px;
        background-color: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        margin-bottom: 20px;
    }
    .points-banner {
        background: linear-gradient(90deg, #0071e3 0%, #0077ed 100%);
        padding: 24px;
        border-radius: 24px;
        color: white;
        margin-bottom: 30px;
        position: relative;
        overflow: hidden;
    }
    .points-banner::after {
        content: '⚡';
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 100px;
        opacity: 0.1;
    }
    .leaderboard-card {
        padding: 15px 25px;
        border-radius: 20px;
        background-color: white;
        border: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    .rank-badge {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-right: 15px;
    }
    </style>
    """, unsafe_allow_html=True)

# --- DATA ---
if 'users' not in st.session_state:
    st.session_state.users = [
        {"id": "u1", "name": "Ramesh Kumar", "employeeId": "NIA001", "pin": "1234", "role": "resident", "balance": 185},
        {"id": "u2", "name": "Priya Sharma", "employeeId": "NIA002", "pin": "1234", "role": "resident", "balance": 340},
        {"id": "u3", "name": "Arjun Patel", "employeeId": "NIA003", "pin": "1234", "role": "resident", "balance": 72},
        {"id": "u4", "name": "Sunita Devi", "employeeId": "NIA004", "pin": "1234", "role": "resident", "balance": 0},
        {"id": "u5", "name": "Rajan EAE", "employeeId": "EAE001", "pin": "0000", "role": "eae", "balance": 0},
    ]

if 'products' not in st.session_state:
    st.session_state.products = [
        {"id": 5, "name": "Co-Living Housing", "category": "studio", "emoji": "🏠", "price": 3999, "period": "/mo"},
        {"id": 6, "name": "Daily Meals Plan", "category": "studio", "emoji": "🍛", "price": 1499, "period": "/mo"},
        {"id": 1, "name": "Job Matching Service", "category": "flow", "emoji": "💼", "price": 199, "period": "/mo"},
        {"id": 10, "name": "Digital Literacy Course", "category": "tribe", "emoji": "📱", "price": 249, "period": ""},
    ]

if 'transactions' not in st.session_state:
    st.session_state.transactions = []

if 'user' not in st.session_state:
    st.session_state.user = None

# --- AUTH LOGIC ---
def login(emp_id, pin):
    for u in st.session_state.users:
        if u['employeeId'] == emp_id and u['pin'] == pin:
            st.session_state.user = u
            return True
    return False

def logout():
    st.session_state.user = None
    st.rerun()

# --- APP FLOW ---
if st.session_state.user is None:
    # --- LOGIN PAGE ---
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown("<div style='text-align: center; margin-top: 50px;'>", unsafe_allow_html=True)
        st.markdown("<h1>Nia One</h1>", unsafe_allow_html=True)
        st.markdown("<p style='color: #6e6e73;'>Sign in to your account</p>", unsafe_allow_html=True)
        
        emp_id = st.text_input("Employee ID", placeholder="e.g. NIA001")
        pin = st.text_input("PIN", type="password", placeholder="4-digit PIN")
        
        if st.button("Sign In"):
            if login(emp_id, pin):
                st.rerun()
            else:
                st.error("Invalid Employee ID or PIN")
        st.markdown("</div>", unsafe_allow_html=True)

else:
    user = st.session_state.user

    # --- SIDEBAR NAV ---
    with st.sidebar:
        st.title("Nia Studio")
        st.write(f"Logged in as: **{user['name']}**")
        st.write(f"Role: `{user['role'].upper()}`")
        
        if user['role'] == 'resident':
            page = st.radio("Navigation", ["Home & Store", "Leaderboard"])
        else:
            page = st.radio("Navigation", ["Manual Ledger", "Leaderboard"])
            
        if st.button("Sign Out"):
            logout()

    # --- PAGES ---
    if page == "Home & Store":
        # --- POINTS BANNER ---
        st.markdown(f"""
            <div class="points-banner">
                <p style="text-transform: uppercase; font-size: 10px; font-weight: bold; margin-bottom: 5px; opacity: 0.8;">⚡ Your Points</p>
                <h1 style="margin: 0;">{user['balance']} <span style="font-size: 14px; opacity: 0.7;">PTS</span></h1>
                <p style="font-size: 12px; margin-top: 10px; opacity: 0.9;">You're 30 pts away from a free Umoja meal →</p>
            </div>
        """, unsafe_allow_html=True)
        
        st.title("The Nia Store.")
        st.write("Everything you need to work, live, and thrive.")
        
        # --- FILTERS ---
        cats = ["All", "Studio", "Flow", "Tribe"]
        cols = st.columns(len(cats))
        cat_filter = "All"
        # In Streamlit, native buttons don't hold state easily without radio/select, 
        # so we'll use a simple selectbox for robust filtering
        cat_filter = st.selectbox("Category Filter", cats)
        
        search = st.text_input("Search services...", "")
        
        # --- PRODUCT GRID ---
        filtered = st.session_state.products
        if cat_filter != "All":
            filtered = [p for p in filtered if p['category'].lower() == cat_filter.lower()]
        if search:
            filtered = [p for p in filtered if search.lower() in p['name'].lower()]
            
        cols = st.columns(3)
        for i, p in enumerate(filtered):
            with cols[i % 3]:
                st.markdown(f"""
                    <div class="card">
                        <h1 style="font-size: 40px; margin: 0;">{p['emoji']}</h1>
                        <p style="color: #0071e3; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-top: 10px;">{p['category']}</p>
                        <h4 style="margin: 5px 0;">{p['name']}</h4>
                        <p style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">₹{p['price']:,}{p['period']}</p>
                    </div>
                """, unsafe_allow_html=True)
                if st.button(f"Add to Bag", key=f"btn_{p['id']}"):
                    st.success(f"Added {p['name']} to bag!")

    elif page == "Leaderboard":
        st.title("Kush-12 Points Leaderboard")
        st.write("Top Contributors & Community Members")
        
        sorted_users = sorted([u for u in st.session_state.users if u['role'] == 'resident'], key=lambda x: x['balance'], reverse=True)
        
        for i, u in enumerate(sorted_users):
            bgcolor = "#ffffff"
            if i == 0: bgcolor = "#fffbeb"
            elif i == 1: bgcolor = "#f8fafc"
            
            st.markdown(f"""
                <div class="leaderboard-card" style="background-color: {bgcolor};">
                    <div style="display: flex; align-items: center;">
                        <div class="rank-badge" style="background-color: {'#fbbf24' if i==0 else '#94a3b8' if i==1 else '#e5e7eb'}; color: {'white' if i<2 else '#6b7280'};">
                            {i+1}
                        </div>
                        <div>
                            <p style="font-weight: bold; margin: 0; font-size: 18px;">{u['name']}</p>
                            <p style="color: #6b7280; font-size: 12px; margin: 0;">{u['employeeId']}</p>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <p style="color: #0071e3; font-weight: 900; font-size: 24px; margin: 0;">{user['balance']} <span style="font-size: 12px; color: #6b7280;">PTS</span></p>
                    </div>
                </div>
            """, unsafe_allow_html=True)

    elif page == "Manual Ledger":
        st.title("Manual Ledger")
        st.write("Phase 0 Pilot: Spreadsheets Digital Proxy")
        
        residents = [u for u in st.session_state.users if u['role'] == 'resident']
        
        for u in residents:
            with st.expander(f"{u['name']} (NIA: {u['employeeId']}) - Current: {u['balance']} pts"):
                act = st.selectbox("Action", ["Morning Check (+5)", "Common Cleanup (+3)", "Jambo Attendance (+10)", "Violation (-15)"], key=f"sel_{u['id']}")
                if st.button("Log Action", key=f"log_{u['id']}"):
                    points = 5 if "Check" in act else 3 if "Cleanup" in act else 10 if "Jambo" in act else -15
                    u['balance'] += points
                    st.success(f"Updated {u['name']}'s balance to {u['balance']} pts")
                    st.rerun()

st.markdown("---")
st.caption("© 2026 Nia One Ecosystem. Optimized for Streamlit Hosting.")
